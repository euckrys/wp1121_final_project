"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type MyTimePickerProps = {
    setStartHour: React.Dispatch<React.SetStateAction<string>>,
    setStartMinute: React.Dispatch<React.SetStateAction<string>>,
    setEndHour: React.Dispatch<React.SetStateAction<string>>,
    setEndMinute: React.Dispatch<React.SetStateAction<string>>,
}

export default function MyTimePicker ({
    setStartHour,
    setStartMinute,
    setEndHour,
    setEndMinute
}: MyTimePickerProps) {

    return (
        <div>
            <Select
            onValueChange={(value) => {
                setStartHour(value);
            }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="開始時間(HH)" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="00">00</SelectItem>
                    <SelectItem value="01">01</SelectItem>
                    <SelectItem value="02">02</SelectItem>
                    <SelectItem value="03">03</SelectItem>
                    <SelectItem value="04">04</SelectItem>
                    <SelectItem value="05">05</SelectItem>
                    <SelectItem value="06">06</SelectItem>
                    <SelectItem value="07">07</SelectItem>
                    <SelectItem value="08">08</SelectItem>
                    <SelectItem value="09">09</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="13">13</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="17">17</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="19">19</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="21">21</SelectItem>
                    <SelectItem value="22">22</SelectItem>
                    <SelectItem value="23">23</SelectItem>
                </SelectContent>
            </Select>

            <Select
                onValueChange={(value) => {
                    setStartMinute(value);
                }}
                >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="開始時間(mm)" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="00">00</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                </SelectContent>
            </Select>

            <Select
                onValueChange={(value) => {
                    setEndHour(value);
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="結束時間(HH)" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="00">00</SelectItem>
                    <SelectItem value="01">01</SelectItem>
                    <SelectItem value="02">02</SelectItem>
                    <SelectItem value="03">03</SelectItem>
                    <SelectItem value="04">04</SelectItem>
                    <SelectItem value="05">05</SelectItem>
                    <SelectItem value="06">06</SelectItem>
                    <SelectItem value="07">07</SelectItem>
                    <SelectItem value="08">08</SelectItem>
                    <SelectItem value="09">09</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="13">13</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="17">17</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="19">19</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="21">21</SelectItem>
                    <SelectItem value="22">22</SelectItem>
                    <SelectItem value="23">23</SelectItem>
                </SelectContent>
            </Select>

            <Select
                onValueChange={(value) => {
                    setEndMinute(value);
                }}
                >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="結束時間(mm)" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="00">00</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
