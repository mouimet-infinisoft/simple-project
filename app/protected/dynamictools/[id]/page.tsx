export default async function DynamicToolPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        Dynamic Tool ID {params?.id} Page
      </div>
    </div>
  );
}
