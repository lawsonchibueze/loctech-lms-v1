"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<any>();
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

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async () => {
    if (file) {
      try {
        await uploadNewFile().then(async (e) => {
          await axios.patch(`/api/courses/${courseId}`, {
            imageUrl: e.secure_url,
          });
          console.log("e", e);
        });
        setIsLoading(false);
        toast.success("Course updated");
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    } else {
      toast.error("Please add image");
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
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div className="flex flex-col gap-2">
          {/* <div className="text-base font-normal text-gray-900">
            Upload image
          </div> */}
          <label
            className="cursor-pointer group flex flex-col gap-2 items-center justify-center border border-dashed w-full h-[300px] rounded-lg"
            id="upload"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
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
                  Click to upload image
                </div>
              </>
            )}
            <input
              type="file"
              hidden
              id="upload"
              name="file"
              accept="image/*"
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
            16:9 aspect ratio recommended
          </div>
        </div>
        // <div>
        //   <Input type="file" onChange={(e) => setFile(e.target.files![0])} />

        //   {!isLoading ? (
        //     <Button
        //       onClick={onSubmit}
        //       // variant="outline"
        //       className="mt-5"
        //     >
        //       Upload
        //     </Button>
        //   ) : (
        //     <Button disabled className="mt-5">
        //       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        //       Please wait
        //     </Button>
        //   )}
        //   <div className="text-xs text-muted-foreground mt-4">
        //     16:9 aspect ratio recommended
        //   </div>
        // </div>
      )}
    </div>
  );
};
