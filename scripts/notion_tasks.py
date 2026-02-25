#!/usr/bin/env python3
import argparse
import os
import sys
import requests

API = "https://api.notion.com/v1"
VERSION = "2025-09-03"


def headers():
    key = os.getenv("NOTION_API_KEY")
    if not key:
      print("Missing NOTION_API_KEY", file=sys.stderr)
      sys.exit(1)
    return {
        "Authorization": f"Bearer {key}",
        "Notion-Version": VERSION,
        "Content-Type": "application/json",
    }


def list_tasks(data_source_id: str):
    r = requests.post(f"{API}/data_sources/{data_source_id}/query", headers=headers(), json={"page_size": 100})
    r.raise_for_status()
    results = r.json().get("results", [])
    for row in results:
        title = "".join(t.get("plain_text", "") for t in row.get("properties", {}).get("Name", {}).get("title", []))
        print(f"{row['id']}\t{title}")


def add_task(database_id: str, title: str):
    payload = {
        "parent": {"database_id": database_id},
        "properties": {
            "Name": {"title": [{"text": {"content": title}}]}
        },
    }
    r = requests.post(f"{API}/pages", headers=headers(), json=payload)
    r.raise_for_status()
    data = r.json()
    print(data["id"])


def main():
    p = argparse.ArgumentParser(description="Simple Notion Task Tracker helper")
    sub = p.add_subparsers(dest="cmd", required=True)

    ls = sub.add_parser("list")
    ls.add_argument("--data-source-id", required=True)

    add = sub.add_parser("add")
    add.add_argument("--database-id", required=True)
    add.add_argument("title")

    args = p.parse_args()
    if args.cmd == "list":
        list_tasks(args.data_source_id)
    elif args.cmd == "add":
        add_task(args.database_id, args.title)


if __name__ == "__main__":
    main()
