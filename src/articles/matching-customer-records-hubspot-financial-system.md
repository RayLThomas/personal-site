---
title: "Matching customer records between HubSpot and a financial system"
description: "How I used Excel, Power Query, and ChatGPT to reconcile financial customer accounts with HubSpot companies while preserving existing billing relationships and integrations."
date: 2026-10-17
categories:
  - CRM Architecture
  - Revenue Operations
tags:
  - HubSpot
  - Excel
  - Power Query
  - Data Reconciliation
  - AI
---

I recently worked on a project that required matching customer records between HubSpot and a financial system. On paper, the task was straightforward. Export the customer records from both systems, identify which ones belonged together, and prepare the data for import.

The problem was that we didn't have one consistent identifier we could use to match everything. Some customer records had different names between systems, some contained identifiers from older platforms, and others had multiple possible matches.

There were also existing integrations we had to be careful not to disrupt.

The goal was to prepare HubSpot to serve as the customer source of truth for a self-service ordering platform. The platform would use HubSpot to identify customers and retrieve the financial account information needed to maintain the existing billing and reporting processes.

I handled most of the reconciliation in Excel, with Power Query for the more difficult matches and ChatGPT helping with formulas and troubleshooting.

## The systems didn't define customers the same way

One of the first things we had to account for was how each system represented a customer.

HubSpot contained the CRM company records, along with properties holding identifiers from several legacy systems. The financial system maintained customer accounts used for billing, transactions, and reporting.

Those records didn't always have a one-to-one relationship.

A single HubSpot company could correspond to multiple accounts in the financial system. The CRM might view those accounts as one company, but Finance still needed them separated for its own processes.

That distinction affected how we planned to store the financial records in HubSpot.

We could have added another property to the company object to hold a financial customer ID. That would have been relatively simple, but it wouldn't properly account for companies with multiple financial accounts.

Instead, we used a HubSpot custom object to represent those accounts individually.

Each financial customer record could then be associated with its corresponding HubSpot company. This allowed us to maintain the individual financial accounts without creating duplicate CRM companies simply to accommodate billing relationships.

It also meant the ordering platform could retrieve the appropriate financial account information through HubSpot while preserving the identifiers that the existing financial processes depended on.

## We also had to leave some existing CRM problems alone

There were duplicate companies in HubSpot that probably should have been merged.

Normally, cleaning those up would make sense. But some external applications were already referencing those companies using their HubSpot Record IDs.

Merging the records could change which IDs those applications needed to reference. Unless we coordinated those changes with every dependent application, we risked breaking integrations that were otherwise working.

So we deliberately kept company deduplication outside the scope of this project.

I think this is something worth considering whenever you're working with an established CRM. You might identify a data-quality issue and know exactly how to fix it, but that doesn't necessarily mean you should fix it as part of the project you're working on.

In our case, the immediate requirement was to establish reliable associations between financial accounts and CRM companies. We could accomplish that without introducing the additional risk of merging existing company records.

## Building the matching logic in Excel

I chose Excel for the reconciliation because I needed to review the results, adjust the matching logic, and investigate exceptions as we went.

I kept the original HubSpot and financial-system exports in separate tables and used another table to work through the matching process.

The final output needed to contain the financial customer information and the corresponding HubSpot Company Record ID so we could create the custom object records and their associations.

Initially, I worked through the identifiers available in both systems.

Using Excel functions such as `XLOOKUP`, `FILTER`, `TEXTJOIN`, and `LET`, I built columns that evaluated different potential matches.

One thing I wanted to avoid was having Excel return a single Record ID when multiple companies met the same condition.

A traditional `XLOOKUP` can find the first matching value, but that doesn't tell you whether other records also match. For this project, that was an important distinction.

If two HubSpot companies shared an identifier, I wanted to see both records rather than have a formula silently choose one.

So the matching logic needed to account for records with one match, multiple matches, or no match at all.

We also needed a priority order.

A direct match on a known identifier carried more weight than a company-name match. Other fields could help narrow down the possibilities, but I didn't want a weaker matching method overriding a more reliable one.

### Matching on company names and addresses

After working through the identifiers, I moved on to company names.

Some records matched exactly. Others had differences that made an exact comparison unreliable.

That's fairly common when you're dealing with systems that have been around for a while. One system might contain a company's legal name, while another uses an abbreviation, an older name, or a shortened version.

I used company-name comparisons to identify additional candidates, then brought addresses into the process to help validate them.

When several HubSpot companies had the same name, for example, comparing addresses helped determine which record was more likely to be correct.

We also considered activity dates when trying to distinguish between otherwise similar records, although I wouldn't consider recent activity sufficient evidence of a match by itself.

The idea was to use the available data to build confidence in a match rather than relying on one field to make every decision.

## Power Query helped with records that still didn't match

Eventually, the exact matching methods stopped producing many additional results.

At that point, we were mostly dealing with records that had naming differences, incomplete information, or no obvious corresponding company in HubSpot.

I used Power Query's fuzzy matching capabilities to work through the remaining records.

I loaded the unresolved financial records and the HubSpot company data into Power Query, then used a fuzzy merge to compare their company names.

Unlike an exact lookup, fuzzy matching can return candidates when the text isn't identical.

For example, a business recorded under its full legal name in one system might have a shortened name in the other.

The fuzzy merge allowed me to identify potential matches, expand the results to include additional CRM fields, and bring those candidates back into Excel for review.

I included information such as the HubSpot Record ID, company name, address, and activity date so I could compare more than the name alone.

I didn't automatically accept the fuzzy matches.

A similar company name is useful evidence, especially when the addresses agree, but it doesn't prove that two records represent the same customer.

I used Power Query to find candidates that the formulas had missed. The actual decision about whether those records belonged together still depended on the supporting information.

## Using ChatGPT to develop and troubleshoot the formulas

ChatGPT was involved throughout the Excel work, primarily helping me write formulas, combine matching conditions, and troubleshoot results that weren't behaving as expected.

I would explain the matching logic I wanted, have it generate a formula, test the results, and make adjustments from there.

That was useful, particularly once the formulas started getting more complicated.

However, there were several occasions when the formula was technically correct but the matching logic was wrong.

In one case, ChatGPT assumed two fields represented the same type of identifier because their names and purposes appeared related.

They didn't.

The formulas worked, but they weren't returning the matches we expected.

I had to clarify how identifiers from the older systems related to the current CRM properties before we could correct the logic.

We ran into a similar issue when a revised formula actually reduced the number of matched records.

The additional conditions sounded reasonable, but they changed how the matching rules interacted and caused previously identified matches to disappear.

That required revisiting the order of the matching methods and checking which conditions were excluding records.

There were also smaller Excel issues, including empty strings affecting counts and formula dependencies that could create circular references.

None of this meant ChatGPT wasn't useful. It saved me from having to write and troubleshoot every formula manually.

But I couldn't assume that a formula was correct just because Excel accepted it and returned results.

I still needed to understand the data, evaluate whether the results made sense, and explain the business rules that weren't obvious from the column names.

For this type of work, I found it more effective to build and test one matching method at a time rather than trying to generate one complicated formula that handled every possible situation.

## Getting the reconciled records into HubSpot

Once the reconciliation was complete, we had the information needed to establish the relationships between the financial customer records and their corresponding HubSpot companies.

The financial accounts were represented using the custom object, with associations to the appropriate company records.

This preserved the separation between CRM company identity and financial account identity.

It also gave the self-service ordering platform a way to retrieve the financial identifiers needed for existing billing and reporting processes without requiring the financial system to change how it managed its customer accounts.

The reconciliation and HubSpot data structure were completed, while the broader company deduplication work remained outside the scope of the integration.

Looking back, the Excel formulas weren't particularly complicated individually. The difficulty came from figuring out which records should match, how much confidence we could place in each method, and what might happen elsewhere if we changed the wrong thing.

Excel and Power Query gave me the tools to work through the data, and ChatGPT helped speed up the technical work.

The decisions that mattered most were about the relationships between the systems and what the business needed those relationships to support.

That's where I spent most of my time, and where I'd start if I were approaching a similar project again.
