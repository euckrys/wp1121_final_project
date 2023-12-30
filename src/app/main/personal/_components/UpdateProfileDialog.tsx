"use client";

import { useState } from "react";
import Resizer from "react-image-file-resizer";

import { useSession } from "next-auth/react";
import Image from "next/image";

import Input from "@/app/_components/AuthInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserInfo from "@/hooks/useUserInfo";

type UpdateProfileDialogProps = {
  _displayName: string;
  _sportType: string;
  _age: string;
  _height: string;
  _weight: string;
  _place: string;
  _license: string;
  _introduce: string;
  _avatar: string;
  showDialog: boolean;
  onclose: () => void;
};

export default function UpdateProfileDialog({
  _displayName,
  _sportType,
  _age,
  _height,
  _weight,
  _place,
  _license,
  _introduce,
  _avatar,
  showDialog,
  onclose,
}: UpdateProfileDialogProps) {
  const { data: session } = useSession();
  const { updateUserInfo, loading } = useUserInfo();

  const [displayName, setDisplayName] = useState<string>(_displayName);
  const [sportType, setSportType] = useState<string>(_sportType);
  const [age, setAge] = useState<string>(_age);
  const [height, setHeight] = useState<string>(_height);
  const [weight, setWeight] = useState<string>(_weight);
  const [place, setPlace] = useState<string>(_place);
  const [license, setLicense] = useState<string>(_license);
  const [introduce, setIntroduce] = useState<string>(_introduce);
  const [avatarUrl, setAvatarUrl] = useState<string>(_avatar);

  const handleUpdate = async () => {
    try {
      await updateUserInfo({
        displayName,
        sportType,
        age,
        height,
        weight,
        place,
        license,
        introduce,
        avatarUrl,
      });
    } catch (error) {
      console.log(error);
      alert("Error updating profile");
    }

    onclose();
  };

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files === null) return;
      const file = e.target.files[0];
      const image = await resizeFile(file);
      setAvatarUrl(typeof image === "string" ? image : "");
      // console.log(image);
    } catch (err) {
      console.log(err);
    }
  };

  const resizeFile = (file: Blob) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        150,
        150,
        "JPEG",
        250,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
      );
    });

  return (
    <>
      <Dialog open={showDialog} onOpenChange={onclose}>
        <DialogContent className="flex">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Label>Avatar</Label>
            <Image
              src={avatarUrl}
              width={400}
              height={400}
              alt="123"
              className="mr-1 mt-0.5 h-40 w-40 rounded-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImg}
              className="file:text-sx block w-fit border-0 bg-transparent text-sm text-slate-500
                    drop-shadow-none file:mr-4 file:rounded-full
                    file:border-0 file:bg-slate-50
                    file:px-2
                    file:py-1 file:text-slate-700
                    hover:file:bg-slate-100
                  "
            />
          </div>
          <div>
          <div>
            <Label>暱稱</Label>
            <Input
              label=""
              type="text"
              value={displayName}
              setValue={setDisplayName}
            />
          </div>
          <div>
            <Label>運動種類</Label>
            <Select
              onValueChange={(value) => {
                if (value == "%") setSportType("");
                else setSportType(value);
              }}
            >
              <SelectTrigger className="w-[180px]" disabled={loading}>
                <SelectValue placeholder="SportType" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fitness">健身</SelectItem>
                <SelectItem value="swimming">游泳</SelectItem>
                <SelectItem value="yoga">瑜伽</SelectItem>
                <SelectItem value="badminton">羽球</SelectItem>
                <SelectItem value="basketball">籃球</SelectItem>
                <SelectItem value="soccer">足球</SelectItem>
                <SelectItem value="others">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>年齡</Label>
            <Input label="" type="text" value={age} setValue={setAge} />
          </div>
          <div>
            <Label>體重</Label>
            <Input label="" type="text" value={weight} setValue={setWeight} />
          </div>
          <div>
            <Label>身高</Label>
            <Input label="" type="text" value={height} setValue={setHeight} />
          </div>
          {session?.user?.isCoach && (
            <>
              <div>
                <Label>場館</Label>
                <Input label="" type="text" value={place} setValue={setPlace} />
              </div>
              <div>
                <Label>證照資訊</Label>
                <Input
                  label=""
                  type="text"
                  value={license}
                  setValue={setLicense}
                />
              </div>
              <div>
                <Label>介紹/教學理念</Label>
                <Input
                  label=""
                  type="text"
                  value={introduce}
                  setValue={setIntroduce}
                />
              </div>
            </>
          )}
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={loading}>
              更新使用者資料
            </Button>
            <Button onClick={onclose}>取消</Button>
          </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
