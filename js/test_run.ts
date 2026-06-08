import { XhsClient } from "./xhsClient";
import axios from "axios";

const COOKIE = "XXX";

async function runNodeTest() {
  const client = new XhsClient();
  const apiPath = "/api/sns/web/v1/homefeed";
  const payload = {
    cursor_score: "",
    num: 40,
    refresh_type: 1,
    note_index: 0,
    unread_begin_note_id: "",
    unread_end_note_id: "",
    unread_note_count: 0,
    category: "homefeed_recommend",
  };

  const sig = client.sign(apiPath, payload, COOKIE, "POST");

  try {
    const res = await axios.post(
      "https://edith.xiaohongshu.com" + apiPath,
      payload,
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Cookie: COOKIE,
          "x-s": sig.xs,
          "x-t": sig.xt,
          "x-s-common": sig.xs_common,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      },
    );
    console.log("=== Node.js API Test ===");
    console.log("Success! Status code:", res.status);
    console.log(
      "Response JSON:",
      JSON.stringify(res.data).substring(0, 150) + "...",
    );
  } catch (err: any) {
    console.error("API Request Failed!");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

runNodeTest();
