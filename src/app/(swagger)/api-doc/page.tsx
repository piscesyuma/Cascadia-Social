import dynamic from "next/dynamic";

import { getApiDocs } from "@/lib/swagger";

const Swagger = dynamic(() => import("./client"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <Swagger spec={spec} url="/swagger.json" />
    </section>
  );
}

export const metadata = {
  title: "Swagger",
};
