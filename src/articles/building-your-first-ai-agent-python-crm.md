---
title: "Building Your First AI Agent with Python and OpenAI"
description: "A beginner-friendly walkthrough of a small CRM data agent using Python, CSV files, OpenAI tool calling, and a simple execution loop."
date: 2026-10-18
tags:
  - AI
  - Python
  - CRM
  - Tutorial
slug: building-your-first-ai-agent-python-crm
---

I wanted to understand what makes an AI agent different from a normal prompt. Reading about agents helped, but building one made the distinction clearer. This project uses a small CSV of fictional CRM deals, two Python functions, and an OpenAI model. It isn't intended to replace HubSpot reporting or handle real customer data.

The exercise is simple: ask a question in plain English, let the model decide which function to call, execute that function in Python, and give the result back to the model for an answer.

## What we're building

The agent runs in a Windows terminal. You can ask it to find open deals over $5,000 or summarize pipeline by owner. It uses two predefined tools:

- `get_deals()` filters records by amount, stage, or owner.
- `summarize_pipeline()` calculates deal counts and totals grouped by owner or stage.

The model **does not edit Python code** to apply a filter. It supplies arguments to a function we've already written. The surrounding Python program, often called the *harness*, manages the API requests, runs approved functions, and returns results.

That separation is the main lesson. The model decides which available tool to request; our code controls what can actually execute.

## Prerequisites

You'll need Python installed on Windows, a code editor such as VS Code, and an OpenAI API key. API usage is billed separately from a ChatGPT subscription. Keep the key out of source control.

In Command Prompt (`cmd`), create the project:

```bat
mkdir my-first-agent
cd my-first-agent
python -m venv .venv
.venv\Scripts\activate.bat
python -m pip install openai
```

The virtual environment keeps the project's Python packages separate from other projects. You create it once, although a new terminal session normally requires activation. We'll make a one-click launcher later.

## Create fictional CRM data

Save this as `deals.csv` in the project folder:

```csv
deal_id,deal_name,amount,stage,owner,close_date
101,Website Redesign,8500,open,Sarah,2026-11-15
102,CRM Migration,12000,closed_won,James,2026-09-20
103,Marketing Automation,4500,open,Sarah,2026-12-01
104,Data Integration,18000,open,Michael,2026-11-30
105,Sales Enablement,6500,closed_lost,James,2026-08-10
106,RevOps Consulting,15000,open,Sarah,2026-12-15
107,HubSpot Onboarding,3500,closed_won,Michael,2026-07-22
108,Reporting Dashboard,7200,open,James,2026-11-10
109,API Development,22000,closed_won,Sarah,2026-10-01
110,Lead Scoring Setup,5500,open,Michael,2026-12-20
```

Ten records are enough to verify the logic without adding database setup or API permissions. In this sample, there are six open deals above $5,000.

## Write the tools

Create `tools.py`:

```python
import csv
from pathlib import Path

CSV_FILE = Path(__file__).parent / "deals.csv"


def get_deals(min_amount=0, stage=None, owner=None):
    """Return CRM deals matching optional filters."""
    with open(CSV_FILE, newline="", encoding="utf-8") as file:
        deals = list(csv.DictReader(file))

    results = []
    for deal in deals:
        deal["amount"] = float(deal["amount"])
        if deal["amount"] < min_amount:
            continue
        if stage and deal["stage"].lower() != stage.lower():
            continue
        if owner and deal["owner"].lower() != owner.lower():
            continue
        results.append(deal)
    return results


def summarize_pipeline(group_by="owner", stage=None):
    """Return deal counts and totals grouped by owner or stage."""
    if group_by not in ("owner", "stage"):
        raise ValueError("group_by must be 'owner' or 'stage'")

    summary = {}
    for deal in get_deals(stage=stage):
        key = deal[group_by]
        summary.setdefault(key, {"count": 0, "total": 0})
        summary[key]["count"] += 1
        summary[key]["total"] += deal["amount"]
    return summary
```

Test the functions before introducing AI:

```bat
python -c "from tools import get_deals; print(get_deals(min_amount=5000, stage='open'))"
```

This is ordinary Python. There is no agent yet. The functions become *tools* when we describe them to the model and allow our harness to execute their requests.

## Connect the OpenAI model

Create an API key at [OpenAI's API dashboard](https://platform.openai.com/api-keys). For a persistent user-level environment variable, run this in **PowerShell** (not Command Prompt), replacing the placeholder:

```powershell
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "YOUR_API_KEY", "User")
```

Open a new terminal after setting it. Avoid putting the key directly in `agent.py`.

Create `agent.py`:

```python
import json
import os
from openai import OpenAI
from tools import get_deals, summarize_pipeline

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

TOOLS = [
    {
        "type": "function",
        "name": "get_deals",
        "description": "Retrieve CRM deals filtered by minimum amount, stage, or owner.",
        "parameters": {
            "type": "object",
            "properties": {
                "min_amount": {"type": "number"},
                "stage": {"type": "string"},
                "owner": {"type": "string"},
            },
            "required": [],
            "additionalProperties": False,
        },
        "strict": False,
    },
    {
        "type": "function",
        "name": "summarize_pipeline",
        "description": "Summarize deal counts and amounts grouped by owner or stage.",
        "parameters": {
            "type": "object",
            "properties": {
                "group_by": {"type": "string", "enum": ["owner", "stage"]},
                "stage": {"type": "string"},
            },
            "required": [],
            "additionalProperties": False,
        },
        "strict": False,
    },
]

FUNCTIONS = {
    "get_deals": get_deals,
    "summarize_pipeline": summarize_pipeline,
}

conversation = []
MAX_ROUNDS = 5

print("CRM Agent Ready. Type 'exit' to quit.")

while True:
    question = input("\nYou: ").strip()
    if question.lower() == "exit":
        break
    if not question:
        continue

    conversation.append({"role": "user", "content": question})

    for _ in range(MAX_ROUNDS):
        response = client.responses.create(
            model="gpt-5-mini",
            instructions=(
                "You are a CRM data analyst. Use available tools to answer "
                "questions about CRM data. Never invent CRM data."
            ),
            input=conversation,
            tools=TOOLS,
        )

        conversation.extend(
            item.model_dump(exclude_none=True) for item in response.output
        )

        tool_calls = [
            item for item in response.output if item.type == "function_call"
        ]
        if not tool_calls:
            print("\nAgent:", response.output_text)
            break

        for call in tool_calls:
            print(f"\n[Tool requested: {call.name}]")
            print(f"[Arguments: {call.arguments}]")
            try:
                function = FUNCTIONS[call.name]
                arguments = json.loads(call.arguments)
                result = function(**arguments)
                output = json.dumps(result)
            except Exception as error:
                output = json.dumps({"error": str(error)})

            print(f"[Tool returned: {output}]")
            conversation.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": output,
            })
    else:
        print("\nAgent: Maximum tool rounds reached.")
```

The tool definitions tell the model what functions exist and what arguments each accepts. The `FUNCTIONS` dictionary connects those names to real Python functions. The loop sends the conversation to the model, executes any requested tools, appends their outputs, and asks the model again. It stops when the model returns a normal answer or the loop reaches its limit.

That loop is the core of our small agent harness.

## Run it

From the project directory, with the virtual environment active:

```bat
python agent.py
```

Try:

> Find all open deals worth more than $5,000 and tell me which owner has the largest open pipeline.

Watch the terminal output. You should see tool names, arguments, and returned records before the final answer. The model may use one or both functions, and the exact sequence can vary.

With this dataset, Sarah has the largest open pipeline: $28,000 across three deals, including one below the $5,000 filter. If you ask specifically for open deals *above $5,000*, Sarah's matching total is $23,500. This distinction is worth checking when validating an agent's answer.

## Make it easy to launch

Create `start-agent.bat` in the project folder:

```bat
@echo off
title CRM AI Agent
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo ERROR: Python virtual environment not found.
    pause
    exit /b 1
)

".venv\Scripts\python.exe" agent.py
pause
```

Double-clicking the batch file starts the agent using the correct Python environment, even if you haven't activated it manually.

The completed folder contains:

```text
my-first-agent/
├── .venv/
├── agent.py
├── tools.py
├── deals.csv
└── start-agent.bat
```

## What this agent can and cannot do

This agent can choose between two predefined tools, pass arguments, inspect results, and answer follow-up questions using conversation history. It does not write new Python functions, access HubSpot, discover additional datasets, or modify CRM records.

Those limits are intentional. If you ask it to identify the most effective outbound channel for the best-performing rep, the CSV doesn't contain the activity history needed to answer. A well-behaved agent should say so rather than invent an explanation.

For more flexible analysis, a later version could add schema discovery and read-only SQL queries against a local database. Arbitrary code execution would require additional safeguards, including a genuine sandbox and approval controls. Neither is necessary to learn tool calling.

The useful takeaway from this project is narrower: **the model requests actions, but the harness decides what can run.** Once that separation makes sense, more elaborate agent architectures are easier to reason about.
