#!/usr/bin/env python3
"""Send a WeCom/Enterprise WeChat notification.

Supports two modes:
1) Group robot webhook: WECOM_WEBHOOK_URL
2) WeCom app message: WECOM_CORP_ID, WECOM_CORP_SECRET, WECOM_AGENT_ID, WECOM_TOUSER

Usage:
  python3 scripts/notify_wecom.py "title" "url" [body]
"""
import json
import os
import sys
import urllib.error
import urllib.request


def post_json(url: str, payload: dict) -> dict:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            return json.loads(raw or "{}")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {raw}") from e


def get_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=20) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        return json.loads(raw or "{}")


def send_webhook(title: str, link: str, body: str) -> dict:
    webhook = os.environ["WECOM_WEBHOOK_URL"]
    content = f"**{title}**\n\n{body}\n\n[查看完整内容]({link})" if link else f"**{title}**\n\n{body}"
    return post_json(webhook, {"msgtype": "markdown", "markdown": {"content": content}})


def send_app_message(title: str, link: str, body: str) -> dict:
    corp_id = os.environ["WECOM_CORP_ID"]
    corp_secret = os.environ["WECOM_CORP_SECRET"]
    agent_id = os.environ["WECOM_AGENT_ID"]
    touser = os.environ.get("WECOM_TOUSER", "@all")

    token_resp = get_json(
        "https://qyapi.weixin.qq.com/cgi-bin/gettoken?"
        f"corpid={corp_id}&corpsecret={corp_secret}"
    )
    if token_resp.get("errcode") != 0:
        raise RuntimeError(f"gettoken failed: {token_resp}")
    token = token_resp["access_token"]

    content = f"**{title}**\n\n{body}\n\n[查看完整内容]({link})" if link else f"**{title}**\n\n{body}"
    payload = {
        "touser": touser,
        "msgtype": "markdown",
        "agentid": int(agent_id),
        "markdown": {"content": content},
        "safe": 0,
    }
    return post_json(
        f"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={token}",
        payload,
    )


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: notify_wecom.py <title> [url] [body]", file=sys.stderr)
        return 2
    title = sys.argv[1]
    link = sys.argv[2] if len(sys.argv) >= 3 else ""
    body = sys.argv[3] if len(sys.argv) >= 4 else "日报已生成并发布。"

    if os.environ.get("WECOM_WEBHOOK_URL"):
        resp = send_webhook(title, link, body)
        mode = "webhook"
    elif all(os.environ.get(k) for k in ["WECOM_CORP_ID", "WECOM_CORP_SECRET", "WECOM_AGENT_ID"]):
        resp = send_app_message(title, link, body)
        mode = "app"
    else:
        raise RuntimeError(
            "Missing WeCom config. Set WECOM_WEBHOOK_URL, or set "
            "WECOM_CORP_ID/WECOM_CORP_SECRET/WECOM_AGENT_ID[/WECOM_TOUSER]."
        )

    if resp.get("errcode", 0) != 0:
        raise RuntimeError(f"WeCom send failed via {mode}: {resp}")
    print(json.dumps({"ok": True, "mode": mode, "response": resp}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
