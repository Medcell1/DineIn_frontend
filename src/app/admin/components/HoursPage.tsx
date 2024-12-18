"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Hours } from "@/@types";
import { Loader2 } from "lucide-react";
import { updateWorkingHours } from "@/action/hours";
import { toast, ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";
import "react-toastify/dist/ReactToastify.css"

export default function WorkHoursPage({ initialWorkHours }: { initialWorkHours: Hours[] }) {
    const { theme } = useTheme()

    const [workHours, setWorkHours] = useState<Hours[]>(initialWorkHours);
    const [isLoading, setIsLoading] = useState(false);

    const handleHoursChange = (id: string, type: "openTime" | "closeTime", value: string) => {
        setWorkHours((prev) =>
            prev.map((hour) =>
                hour.id === id
                    ? {
                        ...hour,
                        [type]: value,
                    }
                    : hour
            )
        );
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateWorkingHours(workHours);
            toast.success("Work hours updated successfully")
        } catch (error) {
            toast.error("Failed to update work hours")

            console.error("Failed to update work hours:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 px-5">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === "dark" ? "dark" : "light"}
            />
            <h2 className="text-3xl font-bold tracking-tight">Work Hours</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Open</TableHead>
                        <TableHead>Close</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workHours.map(({ day, openTime, closeTime, id }) => (
                        <TableRow key={id}>
                            <TableCell>{day}</TableCell>
                            <TableCell>
                                <Input
                                    type="time"
                                    value={convertTo24Hour(openTime)}
                                    onChange={(e) =>
                                        handleHoursChange(id, "openTime", convertTo12Hour(e.target.value))
                                    }
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="time"
                                    value={convertTo24Hour(closeTime)}
                                    onChange={(e) =>
                                        handleHoursChange(id, "closeTime", convertTo12Hour(e.target.value))
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                onClick={handleSave}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading} 
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <Loader2 className="animate-spin mr-2" /> Updating...
                    </div>
                ) : (
                    "Update Work Hours"
                )}
            </Button>
        </div>
    );
}

const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const convertTo12Hour = (time24h: string): string => {
    let [hours, minutes] = time24h.split(":").map(Number);
    const modifier = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${modifier}`;
};
