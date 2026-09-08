# Modernization Assessment Report — Order Service (Java / Spring Boot)

- **Project path:** `app/Java - Spring Boot/Order Service`
- **Assessment date:** 2026-09-08
- **Assessment type:** Read-only inspection (no source modified)
- **Scope:** Java version upgrade, Spring Boot upgrade, dependency/CVE remediation, migration blockers

---

## 1. Current State Summary

| Item | Current Value | Evidence |
|---|---|---|
| Java version (source/target) | **8** | `pom.xml` lines 20–22: `<java.version>8</java.version>`, `<maven.compiler.source>8</maven.compiler.source>`, `<maven.compiler.target>8</maven.compiler.target>`; also `maven-compiler-plugin` config (`pom.xml` lines 82–87) sets `<source>8</source>`/`<target>8</target>` explicitly |
| Spring Boot version | **2.7.18** (parent) | `pom.xml` lines 7–12 |
| Build tool | Maven, `maven-compiler-plugin` 3.15.0, `maven-clean-plugin` 3.5.0 | `pom.xml` lines 73–88 |
| Persistence | Spring Data JPA + H2 (in-memory), Hibernate via Boot 2.7 BOM | `pom.xml` lines 31–43, `application.properties` |
| Web layer | Spring MVC (`spring-boot-starter-web`), Bean Validation (`spring-boot-starter-validation`) | `pom.xml` lines 29, 37 |
| Servlet/validation namespace | **`javax.*`** (pre-Jakarta EE 9) | see §3 |

## 2. Known-Vulnerable / Risky Dependencies (explicit overrides in `pom.xml`)

### 2.1 `log4j-core` 2.14.1 — **Critical**
- `pom.xml` lines 46–51, explicitly pinned and commented: *"Intentionally pinned to a vulnerable version for CVE remediation exercises. Do not use in production."*
- This version is affected by **CVE-2021-44228 (Log4Shell)** and related follow-ups (CVE-2021-45046, CVE-2021-45105). Remote code execution via JNDI lookup in log messages — critical severity (CVSS 10.0 for CVE-2021-44228).
- Note: `spring-boot-starter-parent:2.7.18` normally manages Log4j2 transitively at a patched version (Boot 2.7.x line manages ~2.17.x+), but this project **overrides** the managed version by declaring `log4j-core` directly at `2.14.1`, reintroducing the vulnerability. This is a deliberate demo artifact but must be removed/un-pinned as part of remediation.
- **Fix:** Remove the explicit `log4j-core` dependency entirely (let Spring Boot's dependency management supply a patched version), or if a direct dependency is genuinely needed, pin to ≥2.24.x (latest 2.x) or migrate to a Boot-managed version.

### 2.2 `commons-text` 1.9 — **High**
- `pom.xml` lines 53–57.
- Affected by **CVE-2022-42889 (Text4Shell)** — RCE via unsafe interpolator lookups (`StringSubstitutor`) in versions before 1.10.0.
- **Fix:** Upgrade to `commons-text` ≥ 1.10.0 (current stable is 1.12.0/1.13.x). Verify no code uses `StringSubstitutor` with untrusted input; none found in this codebase (no direct usage of `commons-text` classes detected in `src/main`), but the vulnerable library should still be upgraded or removed if unused.

### 2.3 Spring Boot 2.7.18 (parent) — **End of OSS support**
- Spring Boot 2.7.x reached end of OSS support (Aug 2023); only commercial support available. Boot 2.7 pulls in Spring Framework 5.3.x, which is also past mainstream community support.
- Recommend upgrading to Spring Boot 3.x to receive current security patches and Java 17+/21+/25 compatibility.

## 3. Migration Blockers

### 3.1 `javax.*` → `jakarta.*` namespace migration (blocker for Spring Boot 3.x)
Spring Boot 3.x is built on Spring Framework 6 / Jakarta EE 9+, which renamed all `javax.*` APIs to `jakarta.*`. The following files use the legacy `javax.*` namespace and **must** be migrated before adopting Spring Boot 3:

- `src/main/java/com/contoso/demo/orderservice/model/Order.java` lines 3–14:
  - `javax.persistence.Column`, `Entity`, `EnumType`, `Enumerated`, `GeneratedValue`, `GenerationType`, `Id`, `PrePersist`, `Table` (JPA annotations)
  - `javax.validation.constraints.DecimalMin`, `NotBlank`, `NotNull` (Bean Validation)
- `src/main/java/com/contoso/demo/orderservice/web/OrderController.java` line 17:
  - `javax.validation.Valid`

**Fix:** Replace all `javax.persistence.*` → `jakarta.persistence.*` and `javax.validation.*` → `jakarta.validation.*` imports. No `jakarta.*` imports currently exist anywhere in the codebase (confirmed via search), so this is a full, not partial, migration.

### 3.2 Deprecated `WebMvcConfigurerAdapter`
- `src/main/java/com/contoso/demo/orderservice/config/WebConfig.java` lines 1–21.
- Class extends `org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter`, which was **deprecated since Spring 5.0 and removed** in later Spring Framework versions (the class was already deprecated in Boot 2.x; it will not compile against Spring Framework 6 / Boot 3.x since the class has been removed).
- The file's own comment explicitly flags this as an intentional deprecated-API exercise: *"Uses the deprecated WebMvcConfigurerAdapter on purpose... (WebMvcConfigurerAdapter -> WebMvcConfigurer in Spring 5+)."*
- **Fix:** Change `WebConfig` to `implements WebMvcConfigurer` (interface with default methods) instead of extending the adapter class. This is required for both a clean Spring 5 codebase and is mandatory before Spring Boot 3 migration (the adapter class does not exist in Spring 6).

### 3.3 Permissive CORS configuration (security hardening opportunity, not a strict migration blocker)
- `WebConfig.java` line 18: `.allowedOrigins("*")` combined with methods GET/POST/PATCH on `/api/**`. Wildcard origins on state-changing endpoints (POST/PATCH) is a CSRF/data-exposure risk pattern worth flagging during modernization, though not itself a Java/Boot version blocker.

### 3.4 H2 console enabled
- `application.properties` line 8: `spring.h2.console.enabled=true`. Acceptable for a demo/dev profile, but should be disabled (or profile-gated) for any production-like deployment. Not a migration blocker but a security hygiene item to carry into the modernized configuration.

### 3.5 Java 8 language level / toolchain
- `pom.xml` properties (lines 20–22) and `maven-compiler-plugin` config (lines 84–87) both hardcode Java 8 `source`/`target`. Moving to Java 25 requires updating both the Boot parent's `java.version` property and the explicit compiler plugin `source`/`target` (or better, replace with `<release>` and let Spring Boot's parent manage the compiler plugin version).
- No use of deprecated/removed JDK APIs (e.g., `sun.misc.*`, Nashorn `javax.script` engine, `SecurityManager`, applet APIs) was found in the four production classes and four test classes reviewed — the business logic itself (simple CRUD + BigDecimal aggregation with Java streams) is small and modern-idiom-friendly, so JDK-level code blockers are minimal.
- `spring-boot-maven-plugin` and `maven-clean-plugin`/`maven-compiler-plugin` versions are not otherwise pinned to Boot-managed versions (compiler plugin is explicitly overridden to 3.15.0 with hardcoded Java 8 source/target, which will need to be revisited so it doesn't fight with the parent-managed Java version property after upgrade).

## 4. Dependency Version Inventory (relevant to CVE/migration decisions)

| Dependency | Declared Version | Source | Risk / Note |
|---|---|---|---|
| `spring-boot-starter-parent` | 2.7.18 | `pom.xml:10` | EOL (community support ended), upgrade to 3.x line |
| `spring-boot-starter-web` | managed by parent (2.7.18) | `pom.xml:29` | Upgrades with Boot |
| `spring-boot-starter-data-jpa` | managed by parent (2.7.18) | `pom.xml:33` | Upgrades with Boot; brings Hibernate ORM version tied to Boot 2.7 |
| `spring-boot-starter-validation` | managed by parent (2.7.18) | `pom.xml:37` | Upgrades with Boot |
| `h2` | managed by parent (2.7.18) | `pom.xml:41` | Verify H2 version after Boot upgrade; H2 2.x has had its own CVEs (e.g., CVE-2022-45868) in versions predating what Boot 2.7.18/3.x manage — confirm resolved version via `mvn dependency:tree` post-upgrade |
| `log4j-core` | **2.14.1 (explicit override)** | `pom.xml:50` | **Critical — Log4Shell family CVEs** |
| `commons-text` | **1.9 (explicit)** | `pom.xml:56` | **High — Text4Shell CVE-2022-42889** |
| `spring-boot-starter-test` | managed by parent (2.7.18) | `pom.xml:61` | test scope only |
| `maven-compiler-plugin` | 3.15.0 (explicit, hardcoded to Java 8) | `pom.xml:83` | Needs `source`/`target`/`release` updated to target Java version |
| `maven-clean-plugin` | 3.5.0 (explicit) | `pom.xml:75` | Fine to keep, or defer to Boot parent-managed version |

## 5. Recommended Modernization Path

### Target versions
- **Java: 25** (LTS-track; verify Java 25 is GA and supported by the target Spring Boot release at execution time — as of this assessment, confirm compatibility matrix for the specific Boot 3.x minor release chosen, since very new JDKs sometimes lag official Boot support by a point release).
- **Spring Boot: 3.3.x or later (3.x LTS-track minor)** — Spring Boot 3 requires Java 17 minimum, moves to Jakarta EE 9+ namespace, and receives active security patches.

### Suggested upgrade order (incremental, to de-risk regressions)
1. **Baseline safety net:** Ensure existing tests (`OrderRepositoryTest`, `OrderServiceTest`, `OrderServiceUnitTest`, `OrderControllerTest`) pass and capture current behavior before any change.
2. **Remove/replace the intentionally-vulnerable pinned dependencies first** (independent of Java/Boot upgrade, can be done immediately):
   - Delete the explicit `log4j-core:2.14.1` override (`pom.xml:47-51`) so Boot's managed (patched) version applies, or bump to ≥2.24.x if a direct dependency is truly required.
   - Bump `commons-text` (`pom.xml:53-57`) to ≥1.10.0 (prefer latest 1.12.x/1.13.x) or remove if unused.
3. **Java 8 → Java 17 intermediate step** (Spring Boot 3's minimum): update `java.version`/`maven.compiler.source`/`maven.compiler.target` (or switch to `<maven.compiler.release>`) and re-run tests to confirm no Java 8-specific assumptions break.
4. **Spring Boot 2.7.18 → Spring Boot 3.x parent bump.** This is the point where the `javax.*` → `jakarta.*` migration becomes mandatory:
   - `Order.java`: update `javax.persistence.*` → `jakarta.persistence.*`, `javax.validation.constraints.*` → `jakarta.validation.constraints.*`.
   - `OrderController.java`: update `javax.validation.Valid` → `jakarta.validation.Valid`.
   - `WebConfig.java`: replace `extends WebMvcConfigurerAdapter` with `implements WebMvcConfigurer` (the adapter class is removed in Spring Framework 6).
   - Re-verify H2 console, datasource driver, and Hibernate DDL behavior against Boot 3's managed Hibernate version.
5. **Java 17 → Java 21 → Java 25 incremental bump**, re-running the full test suite and checking for any newly-deprecated/removed JDK APIs at each step (none currently detected in source, but re-check after Boot 3 upgrade pulls in new transitive libraries).
6. **Re-run full dependency vulnerability scan** (e.g., `mvn dependency:tree`, OWASP Dependency-Check, or `mvn versions:display-dependency-updates`) after each major step to confirm no new CVEs are introduced by transitively upgraded libraries (e.g., re-verify H2's resolved version for CVE-2022-45868 status).
7. **Security hygiene follow-ups** (can be done independently of version upgrades): tighten CORS `allowedOrigins` in `WebConfig.java` away from `"*"` for state-changing methods; gate `spring.h2.console.enabled` behind a non-production profile.

### Concrete next steps
1. Run `mvn -f "app/Java - Spring Boot/Order Service/pom.xml" dependency:tree` to confirm actual resolved versions (including transitive H2/Hibernate versions) before making changes.
2. Remove the two intentionally-pinned vulnerable dependency overrides (log4j-core, commons-text) as a fast, low-risk first PR.
3. Create a dedicated migration branch/PR for the Java 8→17 step, then a second PR for the Boot 2.7→3.x + `javax`→`jakarta` + `WebMvcConfigurerAdapter`→`WebMvcConfigurer` changes (these must land together since they are interdependent).
4. Follow with incremental Java 17→21→25 PRs, running the existing 4-class test suite at each stage.
5. Add automated dependency/CVE scanning (e.g., OWASP Dependency-Check or GitHub Dependabot) to prevent regression of pinned-vulnerable-version patterns going forward.

## 6. Files Reviewed (evidence sources)
- `app/Java - Spring Boot/Order Service/pom.xml`
- `app/Java - Spring Boot/Order Service/src/main/resources/application.properties`
- `app/Java - Spring Boot/Order Service/src/main/java/com/contoso/demo/orderservice/OrderServiceApplication.java`
- `app/Java - Spring Boot/Order Service/src/main/java/com/contoso/demo/orderservice/model/Order.java`
- `app/Java - Spring Boot/Order Service/src/main/java/com/contoso/demo/orderservice/model/OrderStatus.java`
- `app/Java - Spring Boot/Order Service/src/main/java/com/contoso/demo/orderservice/config/WebConfig.java`
- `app/Java - Spring Boot/Order Service/src/main/java/com/contoso/demo/orderservice/config/DataSeeder.java`
- `app/Java - Spring Boot/Order Service/src/main/java/com/contoso/demo/orderservice/repository/OrderRepository.java`
- `app/Java - Spring Boot/Order Service/src/main/java/com/contoso/demo/orderservice/service/OrderService.java`
- `app/Java - Spring Boot/Order Service/src/main/java/com/contoso/demo/orderservice/web/OrderController.java`
- `app/Java - Spring Boot/Order Service/src/test/java/...` (4 test classes, reviewed for JDK/Boot API usage)

*No application source code was modified as part of this assessment.*
