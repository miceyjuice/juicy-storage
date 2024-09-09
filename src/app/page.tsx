"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useSession, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
    const organization = useOrganization();
    const user = useUser();

    const [selectedFile, setSelectedFile] = useState<File | undefined>();

    const orgId = (organization.isLoaded && organization.organization?.id) || (user.isLoaded && user.user?.id);

    const saveFile = useMutation(api.files.createFile);
    const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file) {
            console.log(file);
            setSelectedFile(file);
        }
    }, []);

    const handleFileUpload = useCallback(() => {
        if (selectedFile && orgId) {
            saveFile({
                name: selectedFile.name,
                orgId,
            });
        }
    }, [selectedFile, orgId, saveFile]);

    return (
        <div className="flex min-h-screen flex-col gap-14 pt-10">
            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold">Recent files</h2>
                <div className="flex gap-4 overflow-x-hidden max-w-full">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <div className="w-60 h-40 bg-gray-200 rounded-md"></div>
                            <div className="text-base font-medium px-4 mt-2">File name {index + 1}</div>
                            <div className="text-xs px-4">10 minutes ago</div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold">Upload file</h2>
                <FileUpload
                    handleFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    handleFileUpload={handleFileUpload}
                />
            </section>

            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold">All files</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files?.map((file) => (
                            <TableRow key={file._id}>
                                <TableCell className="font-medium">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{file.name}</TableCell>
                                <TableCell>
                                    <Badge className="bg-blue-500 bg-opacity-75 border-2">Document</Badge>
                                </TableCell>
                                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                                <TableCell className="flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full  hover:bg-slate-200 p-3"
                                    >
                                        <TrashIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </section>
        </div>
    );
}

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
        </svg>
    );
}

interface FileUploadProps {
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileUpload: () => void;
    selectedFile: File | undefined;
}

function FileUpload({ handleFileSelect, handleFileUpload, selectedFile }: FileUploadProps) {
    return (
        <div className="w-full">
            <label
                className={cn(
                    "flex justify-center w-full px-4 transition bg-blue-100 bg-opacity-25 border-2 border-blue-500 border-dashed rounded-md appearance-none hover:border-blue-700 focus:outline-none",
                    selectedFile
                        ? "bg-blue-200 cursor-auto pt-14 pb-12"
                        : "bg-blue-100 cursor-pointer hover:bg-opacity-75 py-14"
                )}
            >
                {selectedFile ? (
                    <div className="flex flex-col justify-center items-center gap-4">
                        <span className="flex justify-center items-center gap-4">
                            <FileIcon />

                            <span className="font-medium text-gray-600">Selected file:</span>
                            <span className="block leading-relaxed text-xs !zm-0 p-0 text-gray-500">
                                {selectedFile.name}
                            </span>
                        </span>
                        <Button className="flex items-center gap-2 rounded-full" onClick={handleFileUpload}>
                            Upload
                            <div className="w-4 h-4">
                                <UploadIcon />
                            </div>
                        </Button>
                    </div>
                ) : (
                    <>
                        <span className="flex flex-col justify-center items-center space-x-2 space-y-2">
                            <UploadIcon />

                            <span className="font-medium text-gray-600">
                                Drag and drop files, or <span className="text-blue-600">Browse</span>
                            </span>
                            <span className="text-xs text-gray-500">Support PDF, TXT, PNG, JPG, JPEG</span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" onChange={handleFileSelect} />
                    </>
                )}
            </label>
        </div>
    );
}

function UploadIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="size-6 max-w-full max-h-full"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
        </svg>
    );
}
function FileIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
        </svg>
    );
}
