"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import Player from "@/components/Video/Player";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<any>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setSelectedImage(null);
    }
  };

  // async function handleUploadFile() {
  //   // If file selected: load file to AWS
  //   if (file) {
  //     // Send file to AWS
  //     var fileKey = file.name
  //       .split(" ")
  //       .join("-")
  //       .split(",")
  //       .join("")
  //       .split("/")
  //       .join("-")
  //       .toLowerCase();
  //     var fileType = file.type;

  //     let formData = new FormData(); //formdata object

  //     formData.append("file", file, file.name); //append the values with key, value pair

  //     // const config = {
  //     //   headers: { "content-type": "multipart/form-data" },
  //     // };

  //     console.log("file", file);

  //     try {
  //       await axios.put(
  //         `/api/courses/${courseId}/chapters/${chapterId}`,
  //         {
  //           method: "POST",
  //           formData,
  //         },
  //         {
  //           headers: {
  //             "Content-type": fileType,
  //             "Access-Control-Allow-Origin": "*",
  //           },
  //         }
  //       );
  //       toast.success("Chapter updated");
  //       toggleEdit();
  //       router.refresh();
  //     } catch {
  //       toast.error("Something went wrong");
  //     }
  //   }
  // }

  const router = useRouter();

  const onSubmit = async () => {
    if (file) {
      try {
        await uploadNewFile().then(async (e) => {
          axios.put(`/api/courses/${courseId}/chapters/${chapterId}`, {
            videoUrl: e.secure_url,
          });
        });
        toast.success("Chapter updated");
        toggleEdit();
        setIsLoading(false);
        router.refresh();
        // setLoading(false);
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      toast.error("Please Upload a video to continue");
    }
  };

  const uploadNewFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chapters");
    setIsLoading(true);
    const data = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((r) => r.json())
      .catch((error) => {
        // toast({
        //   description: `${error}`,
        //   color: "tomato",
        //   variant: "destructive",
        // });
      });

    return data;
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {/* <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} /> */}
            <Player src={initialData.videoUrl} />
          </div>
        ))}
      {isEditing && (
        <div className="gap-4">
          <div className="flex flex-col gap-2">
            {/* <div className="text-base font-normal text-gray-900">
              Upload Video
            </div> */}
            <label
              className="cursor-pointer group flex flex-col gap-2 items-center justify-center border border-dashed w-full h-[300px] rounded-lg"
              id="upload"
            >
              {selectedImage ? (
                <video
                  src={selectedImage}
                  // alt="Selected"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <>
                  <img
                    loading="lazy"
                    src="/add.png"
                    alt="upload icon"
                    className="w-16 h-16 opacity-30 group-hover:opacity-70 transition-opacity duration-500 ease-in-out"
                  />
                  <div className="opacity-30 group-hover:opacity-70 transition-opacity duration-500 ease-in-out">
                    Click to upload Video
                  </div>
                </>
              )}
              <input
                type="file"
                hidden
                id="upload"
                name="file"
                accept="video/*"
                onChange={handleFileChange}
              />
            </label>
            {!isLoading ? (
              <Button
                onClick={onSubmit}
                // variant="outline"
                className="mt-5"
              >
                Save
              </Button>
            ) : (
              <Button disabled className="mt-5">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            )}
            <div className="text-xs text-muted-foreground mt-4">
              Upload this chapter&apos;s video
            </div>
          </div>
          {/* <Input type="file" onChange={(e) => setFile(e.target.files![0])} />
          {!isLoading ? (
            <Button
              onClick={onSubmit}
              // variant="outline"
              className="mt-5"
            >
              Upload
            </Button>
          ) : (
            <Button disabled className="mt-5">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          )}
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div> */}
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};
