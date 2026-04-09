import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { getStorageData, setStorageData } from "../storage.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const data = getStorageData();
  return { data };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  const formData = await request.formData();
  const eventId = formData.get("eventId");

  if (typeof eventId !== "string") {
    return Response.json({ error: "Missing eventId" }, { status: 400 });
  }

  const data = getStorageData();
  delete data[eventId];
  setStorageData(data);

  return Response.json({ ok: true });
};

export const Index = () => {
  const { data } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <s-page heading="A/B Banners">
      <s-section heading="Counters">
        {entries.length > 0 ? (
          <s-table>
            <s-table-header-row>
              <s-table-header>Event</s-table-header>
              <s-table-header>Count</s-table-header>
              <s-table-header></s-table-header>
            </s-table-header-row>
            <s-table-body>
              {entries.map(([eventId, count]) => (
                <s-table-row key={eventId}>
                  <s-table-cell>{eventId}</s-table-cell>
                  <s-table-cell>{count}</s-table-cell>
                  <s-table-cell>
                    <fetcher.Form method="post">
                      <input type="hidden" name="eventId" value={eventId} />
                      <s-button variant="tertiary" tone="critical" type="submit">
                        Clear
                      </s-button>
                    </fetcher.Form>
                  </s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        ) : (
          <s-paragraph>No events tracked yet.</s-paragraph>
        )}
      </s-section>
    </s-page>
  );
};

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

export default Index;
