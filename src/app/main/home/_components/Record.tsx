"use client"

type RecordProps = {
    sportType: string,
    time: string,
    description: string,
}

export default function Record({
    sportType,
    time,
    description,
}: RecordProps) {

    return (
        <div className="grid grid-cols-3 items-center justify-between w-full mb-4">
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-semibold text-xl rounded-full bg-pink-100 px-5 py-1">{sportType}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-semibold text-xl px-5 py-1">{time}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-semibold text-xl px-5 py-1">{description}</p>
            </div>
        </div>
    )
}