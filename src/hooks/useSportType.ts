export default function useSportType () {

    const getSportType = (value: string) => {
        let correctSportType: string = "";
        if (value == "swimming") correctSportType = "游泳";
        else if (value == "fitness") correctSportType = "健身";
        else if (value == "yoga") correctSportType = "瑜伽";
        else if (value == "badminton") correctSportType = "羽球";
        else if (value == "basketball") correctSportType = "籃球";
        else if (value == "soccer") correctSportType = "足球";
        else if (value == "others") correctSportType = "其他";
        return correctSportType;
    }

    return {
        getSportType,
    }
}
