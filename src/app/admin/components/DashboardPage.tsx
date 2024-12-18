"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { UserIcon, MenuIcon, ClockIcon } from 'lucide-react'
import { Stats } from "@/@types"
import { motion } from "framer-motion"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
}

export default function DashboardPage({ stat }: { stat: Stats }) {
    return (
        <motion.div
            className="space-y-6 p-4 sm:p-6 md:p-8 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                variants={itemVariants}
            >
                Dashboard, {stat.user.name}
            </motion.h2>

            <motion.div
                className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
                            <MenuIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.totalMenuItems}</div>
                            <p className="text-xs text-muted-foreground">Across all categories</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Quick Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 space-y-2">
                                <Button asChild className="w-full sm:w-auto">
                                    <a href="/admin/dashboard/profile" className="flex items-center justify-center">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        Profile Page
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                    <a href="/admin/dashboard/menu" className="flex items-center justify-center">
                                        <MenuIcon className="mr-2 h-4 w-4" />
                                        Menu Page
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                    <a href="/admin/dashboard/hours" className="flex items-center justify-center">
                                        <ClockIcon className="mr-2 h-4 w-4" />
                                        Hours Page
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Recent Menu Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[150px] py-2 text-xs">Name</TableHead>
                                        <TableHead className="py-2 text-xs">Category</TableHead>
                                        <TableHead className="py-2 text-xs">Price</TableHead>
                                        <TableHead className="text-right py-2 text-xs">Availability</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stat.recentMenus.map((item: StatMenu) => (
                                        <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium py-2 text-sm">{item.name}</TableCell>
                                            <TableCell className="py-2 text-sm">{item.category}</TableCell>
                                            <TableCell className="py-2 text-sm">${item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right py-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${item.available
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {item.available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}

interface StatMenu {
    id: string;
    name: string;
    price: number;
    image: string;
    available: boolean;
    category: string;
}

