import type { ActionFunctionArgs } from "react-router";
import { getStorageData, setStorageData } from "../storage.server";

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing required query parameter: id" }, { status: 400 });
  }

  const data = getStorageData();
  data[id] = (data[id] ?? 0) + 1;
  setStorageData(data);

  return Response.json({ id, count: data[id] });
}
