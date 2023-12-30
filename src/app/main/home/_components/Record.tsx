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
    let correctSportType = "";

    const getSportType = (value: string) => {
        if (value == "swimming") correctSportType = "游泳";
        else if (value == "fitness") correctSportType = "健身";
        else if (value == "yoga") correctSportType = "瑜伽";
        else if (value == "badminton") correctSportType = "羽球";
        else if (value == "basketball") correctSportType = "籃球";
        else if (value == "soccer") correctSportType = "足球";
        else if (value == "others") correctSportType = "其他";
        return correctSportType;
    }

    return (
        <div className="grid grid-cols-3 items-center justify-between w-full mb-4">
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-semibold text-xl rounded-full bg-pink-100 px-5 py-1">{getSportType(sportType)}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-semibold text-xl px-5 py-1">{time}</p>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center">
                <p className="font-semibold text-xl px-5 py-1 text-center">{description}</p>
            </div>
        </div>
    )
}