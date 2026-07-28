---
published: false                        # Optional. Set to true to publish the workshop (default: false)
type: workshop                          # Required.
title: Full workshop title              # Required. Full title of the workshop
short_title: Short title                # Optional. Short title displayed in the header
description: This is a workshop for...  # Required.
level: beginner                         # Required. Can be 'beginner', 'intermediate' or 'advanced'
authors:                                # Required. You can add as many authors as needed      
  - Name
contacts:                               # Required. Must match the number of authors
  - Author's email, Twitter...
duration_minutes: 20                    # Required. Estimated duration in minutes
tags: javascript, api, node.js          # Required. Tags for filtering and searching
#banner_url: assets/banner.jpg           # Optional. Should be a 1280x640px image
#video_url: https://youtube.com/link     # Optional. Link to a video of the workshop
#audience: students                      # Optional. Audience of the workshop (students, pro devs, etc.)
#wt_id: <cxa_tracking_id>                # Optional. Set advocacy tracking code for supported links
#oc_id: <marketing_tracking_id>          # Optional. Set marketing tracking code for supported links
#navigation_levels: 2                    # Optional. Number of levels displayed in the side menu (default: 2)
#navigation_numbering: true             # Optional. Enable numbering in the side menu (default: true)
#sections_title:                         # Optional. Override titles for each section to be displayed in the side bar
#   - Section 1 title
#   - Section 2 title
---

# Agentic Code Migration with GitHub Copilot

*Version 0.1 - July 2026*

The goal of this workshop is to learn how to use GitHub Copilot, .....

GitHub Copilot is an AI-powered code assistant that helps developers write better code faster. It uses machine learning models trained on billions of lines of code to suggest whole lines or entire functions based on the context of what you’re working on. By using GitHub Copilot, you can learn how to write better code and improve your productivity.

<div class="warning" data-title="warning">

> GitHub Copilot is a quickly evolving product and thus this workshop may not be 100% up to date with the different features of the various extensions you are going to use. Please be adaptable if it's not exactly the same.

</div>

## Minimal Pre-requisites

There are two ways to run this workshop:

- online with **GitHub Codespaces**: fastest and easiest way to start playing immediately with a hosted environment ready to go in seconds.

- locally on **your computer**: the best way to install and configure the tools you need to work with GitHub Copilot on every projects

These are the very minimal pre-requisites to run this workshop:

|                                 |                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------ |
| A GitHub account                | [Create free GitHub account](https://github.com/join)                          |
| GitHub Copilot Access activated | Get Access to GitHub Copilot (section below)                                   |
| A web browser                   | [Download Microsoft Edge](https://www.microsoft.com/edge) or any other one ;-) |

## Get Access to GitHub Copilot

There are different ways to get access to GitHub Copilot:

- **As an individual**, you can sign up to use [Copilot Free](https://github.com/github-copilot/signup), without the need for a credit card. You are entitled to a limited number of completions and chat interactions per month with the free plan, which reset each month. Learn more about the [Copilot Free plan details and conditions](https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot).
- **As an individual**, sign up for a [paid subscription](https://github.com/github-copilot/signup/copilot_individual) to get unlimited completions and chat interactions. You can try GitHub Copilot for free with a one-time 30-day trial.

- **As a member of an organization or enterprise** that has a subscription to GitHub Copilot, you can request access to Copilot by going to [https://github.com/settings/copilot](https://github.com/settings/copilot) and requesting access under "Get Copilot from an organization."

<div class="warning" data-title="warning">

> The **Copilot Free** offer does not include the feature on the github.com platform like the Coding Agent and the Code Review agent that are part of this workshop. You can still run 90% of this workshop with a free subscription but for the rest you will need a paid license.

</div>

## Fork the repository

This workshop uses the following GitHub Repository: *** link to the repo ***

This repository is a code starter that will help you experiment all capabilities with GitHub Copilot. Take the time to look at the architecture design displayed.

Start by creating **your own fork** of the repository by clicking on the `Fork` button on the top right of the repository page. It will create a copy of the repository in your own GitHub account and you will be free to make any changes you want.

![fork repo](assets/fork-repo.png)

## OPTION 1: Work with GitHub Copilot CLI on Codespaces

The environment is already configured to work with [GitHub Codespaces](https://github.com/features/codespaces), you can find the configuration files in the *.devcontainer* folder.

To start programming just start a new codespace and you are ready to go, don't need to install anything.

<div class="info" data-title="note">

> Every individual users of GitHub has a free plan to run the codespace to let you try it with a free 120 core-hours per month [See Pricing](https://github.com/settings/billing/summary)

</div>

![create codespace](assets/create-codespace.png)

After just a few seconds, you will be redirected to your Codespace environment, a full developement environment ready to go in the browser.
**You can start coding right away**, your GitHub Copilot extensions are already installed and configured.

For an even better experience, and if you have VS Code installed on your local computer, you can open the Codespace in your local Visual Studio Code by clicking on the `Open in VS Code` button on the top left menu of your Codespace interface.
![open codespace in vs code menu](assets/codespace-open-vscode.png)

Once the Codespace created, you will be able to choose if you want to open codespace in the browser or in your local VS Code from the GitHub repository page directly.

![open codespace in vscode](assets/open-codespace-vscode.png)

## OPTION 2: Work locally with GitHub Copilot App or GitHub Copilot CLI

You can choose to work locally on your computer for this workshop and take that as an opportunity to install and configure the tools you'll need to work with GitHub Copilot on your projects.

You first need to install the following tools locally:

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
3. Install the [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension
4. Install [Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
5. Install [.NET Core](https://dotnet.microsoft.com/download) \* *needed if you want to run provided .net code*
6. Clone your forked repository and open it in VS Code:

```bash
git clone https://github.com/<YourUser>/gh-copilot-demo
cd gh-copilot-demo
code .
```

Finally, you need login to your GitHub account in Visual Studio Code to activate the GitHub Copilot extensions. The extensions will ask you to login, but if you don't see the prompt, you can login by clicking on the user icon in the bottom left sidebar where you will see the logins for GitHub and GitHub Copilot Chat.

![alt text](assets/gh-login.png)

## How to run the code?

Everything is detailed on the **README.MD** file in the root folder of the code repository.

Take a look at it, and be sure to run at least the front-end app before going further, it will be mandatory to complete the tutorial.

## Help us improve this Workshop

If you face any challenge or bug running this workshop, please let us know. Your help will be invaluable in making this workshop better, specially as we try to maintain it on a regular basis to keep it up-to-date.

[Report any problem here.](https://github.com/Philess/GHCopilotHoL/issues/new)

---

# Level 1: Analyse the existing and build a plan

[Nabil]

Based on the repo: workflow and plugin from Nabil

Assessment, target & build the plan

---

# Level 2: Setup the guardrails

[Philippe]

Marketplace, plugins, agents, skills & instructions, MCP

Update plan

---

# Level 3: Implementation

[Philippe => CLI & Nabil => App]

Multi-agent worflow 
=> choose the right model
=> Autopilot

---

# Level 4: Quality & Security

[Nabil]
Customize Code review
Validate code quality, security
Fix vulnerabilities

--- 

# Level 5: Bonus

[Philippe]
Generer une présentation PPT