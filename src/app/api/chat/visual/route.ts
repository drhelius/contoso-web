
import { type NextRequest } from "next/server";
const api_endpoint = process.env.VISUAL_ENDPOINT!;
const api_key = process.env.VISUAL_KEY!;
const search_endpoint = process.env.SEARCH_ENDPOINT!;
const search_key = process.env.SEARCH_KEY!;
const search_index = process.env.SEARCH_INDEX!;

export async function POST(req: NextRequest) {
  const request_body = await req.json();

  request_body.dataSources[0].parameters.endpoint = search_endpoint;
  request_body.dataSources[0].parameters.key = search_key;
  request_body.dataSources[0].parameters.indexName = search_index;

  const headers = {
    "Content-Type": "application/json",
    "api-key": api_key,
  };

  const response = await fetch(api_endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(request_body),
  });

  const data = await response.json();

  return Response.json(data);
}
