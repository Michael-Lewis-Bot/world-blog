# Task Tracker (Notion) quick ops

This project includes a tiny helper script to interact with your Notion Task Tracker.

## Requirements

- `NOTION_API_KEY` env var set
- Data source shared with your Notion integration

## IDs currently in use

- `database_id`: `31292096-1fff-804d-846d-fabed5823c57`
- `data_source_id`: `31292096-1fff-80a4-b3a0-000b817e66d5`

## Usage

List current tasks:

```bash
python3 scripts/notion_tasks.py list --data-source-id 31292096-1fff-80a4-b3a0-000b817e66d5
```

Add a task:

```bash
python3 scripts/notion_tasks.py add --database-id 31292096-1fff-804d-846d-fabed5823c57 "[Today] publish blog to production"
```
