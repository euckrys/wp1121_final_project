"use client";

type ReplyProps = {
  author: string;
  content: string;
};

export default function Reply({ author, content }: ReplyProps) {
  return (
    <>
      <div className="flex p-2 ">
        <div className="flex w-96 flex-col rounded-md  border-2 border-gray-400 p-2">
          <div className="flex flex-col ">
            <div className="flex flex-row  px-4">
              <div className="flex">
                <div className="flex px-2">
                  <span>{author}</span>
                </div>
                <div className="flex px-2">
                  <div className="rounded-full bg-red-100">
                    <p className="px-4">{content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
