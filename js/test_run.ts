import { XhsClient } from "./xhsClient";
import axios from "axios";

const COOKIE = "abRequestId=52720e9b-80c3-4d97-82a8-58ee7e6585b8; ets=1780393758348; webBuild=6.7.4; xsecappid=xhs-pc-web; loadts=1780393758452; a1=19e87bcce8cbfcpcl2xexwr3trcjwzb3anqryp8in50000152390; webId=b8c039f306e6b90d1ea02d9c2173f673; gid=yjdYWDSSiK0YyjdYWDSSdIUYYSDiSUS1JCdCA3IEFq9FSF28VEuDqv888y2Jqj88Y2i0Y8DS; acw_tc=0a5087bc17803937695065984e5f4e97a600cd38fc2a914682d48d696d47e3; web_session=040069b11c09f4566c3940ef2b384b66cf85bf; id_token=VjEAALisVIfr5l/VcQBLIhWPWhNjTb8HJZv7TrV7T9+8q/gy00IGpUd/wGTo/X1TQaUFUxCnD6RIn5x11LSMUDlMwxr4X7sts+hT92NzVYgaJ52as7ZdLzbwNsFoHOQtPDZSwIdk; x-rednote-datactry=CN; x-rednote-holderctry=CN";

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
    category: "homefeed_recommend"
  };

  const sig = client.sign(apiPath, payload, COOKIE, "POST");

  try {
    const res = await axios.post("https://edith.xiaohongshu.com" + apiPath, payload, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Cookie": COOKIE,
        "x-s": sig.xs,
        "x-t": sig.xt,
        "x-s-common": sig.xs_common,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      }
    });
    console.log("=== Node.js API Test ===");
    console.log("Success! Status code:", res.status);
    console.log("Response JSON:", JSON.stringify(res.data).substring(0, 150) + "...");
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
