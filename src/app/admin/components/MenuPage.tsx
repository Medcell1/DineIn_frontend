"use client"

import { useState } from "react";
import { debounce } from 'lodash';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"
import { Loader2, X, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"

import { Menu, Category, PaginationType } from "@/@types"
import {
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    fetchMenuItemsByUser
} from "@/action/menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface MenuDashboardClientProps {
    initialMenuItems: Menu[];
    initialPagination: PaginationType;
    initialCategories: Category[];
    initialSearch: string;
}

export default function MenuDashboardClient({
    initialMenuItems,
    initialPagination,
    initialCategories,
    initialSearch
}: MenuDashboardClientProps) {
    const { theme } = useTheme();

    const [menuItems, setMenuItems] = useState<Menu[]>(initialMenuItems);
    const [pagination, setPagination] = useState<PaginationType>(initialPagination);
    const [categories] = useState<Category[]>(initialCategories);

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [editingItem, setEditingItem] = useState<Menu | null>(null);
    const [newItem, setNewItem] = useState<{
        name: string;
        price: number;
        measure: string;
        category: string;
        image: File | null;
    }>({
        name: "",
        price: 0,
        measure: "",
        category: "",
        image: null,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [buttonLoading, setButtonLoading] = useState({
        add: false,
        edit: false,
        delete: '',
        toggleAvailability: '',
        search: false,
        pagination: false
    });

    const debouncedSearch = debounce(async (term: string) => {
        try {
            setButtonLoading(prev => ({ ...prev, search: true }));

            const { menuItems: searchedItems, pagination: searchPagination } = await fetchMenuItemsByUser({
                search: term,
                page: 1,
                limit: 10
            });

            setMenuItems(searchedItems);
            setPagination(searchPagination);
        } catch (error) {
            console.error("Error searching menu items:", error);
            toast.error("Failed to search menu items. Please try again.");
        } finally {
            setButtonLoading(prev => ({ ...prev, search: false }));
        }
    }, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        debouncedSearch(term);
    };

    const handlePageChange = async (page: number) => {
        try {
            setButtonLoading(prev => ({ ...prev, pagination: true }));

            const { menuItems: pageItems, pagination: pagePagination } = await fetchMenuItemsByUser({
                search: searchTerm,
                page,
                limit: 10
            });

            setMenuItems(pageItems);
            setPagination(pagePagination);
        } catch (error) {
            console.error("Error changing page:", error);
            toast.error("Failed to load page. Please try again.");
        } finally {
            setButtonLoading(prev => ({ ...prev, pagination: false }));
        }
    };

    const handleAddItem = async () => {
        if (!newItem.name || !newItem.price || !newItem.category || !newItem.image) {
            toast.error("All fields are required");
            return;
        }

        try {
            setButtonLoading(prev => ({ ...prev, add: true }));

            await createMenuItem({
                name: newItem.name,
                price: newItem.price,
                measure: newItem.measure,
                category: newItem.category,
                image: newItem.image
            });

            const { menuItems: updatedItems, pagination: updatedPagination } = await fetchMenuItemsByUser({
                search: searchTerm,
                page: pagination.currentPage,
                limit: 10
            });

            setMenuItems(updatedItems);
            setPagination(updatedPagination);

            setNewItem({
                name: "",
                price: 0,
                measure: "",
                category: "",
                image: null
            });
            setIsDialogOpen(false);
            toast.success("Menu Item Added Successfully");
        } catch (error) {
            console.error("Error adding menu item:", error);
            toast.error("Failed to add menu item. Please try again.");
        } finally {
            setButtonLoading(prev => ({ ...prev, add: false }));
        }
    };

    const handleEditItem = async () => {
        if (!editingItem) return;

        if (!newItem.name || !newItem.price || !newItem.category) {
            toast.error("All fields are required");
            return;
        }

        try {
            setButtonLoading(prev => ({ ...prev, edit: true }));

            const updateData: {
                name?: string;
                price?: number;
                measure?: string;
                category?: string;
                image?: File
            } = {
                name: newItem.name,
                price: newItem.price,
                measure: newItem.measure,
                category: newItem.category
            };

            if (newItem.image) {
                updateData.image = newItem.image;
            }

            await updateMenuItem(editingItem._id, updateData);

            const { menuItems: updatedItems, pagination: updatedPagination } = await fetchMenuItemsByUser({
                search: searchTerm,
                page: pagination.currentPage,
                limit: 10
            });

            setMenuItems(updatedItems);
            setPagination(updatedPagination);

            setNewItem({
                name: "",
                price: 0,
                measure: "",
                category: "",
                image: null
            });
            setEditingItem(null);
            setIsDialogOpen(false);

            toast.success("Menu Item Updated Successfully");
        } catch (error) {
            console.error("Error updating menu item:", error);
            toast.error("Failed to update Menu. Please try again.");
        } finally {
            setButtonLoading(prev => ({ ...prev, edit: false }));
        }
    };

    const handleDeleteItem = async () => {
        if (!deleteItemId) return;

        try {
            setButtonLoading(prev => ({ ...prev, delete: deleteItemId }));

            await deleteMenuItem(deleteItemId);

            const { menuItems: updatedItems, pagination: updatedPagination } = await fetchMenuItemsByUser({
                search: searchTerm,
                page: pagination.currentPage,
                limit: 10
            });

            setMenuItems(updatedItems);
            setPagination(updatedPagination);

            setDeleteItemId(null);
            toast.success("Menu Item Deleted Successfully");
        } catch (error) {
            console.error("Error deleting menu item:", error);
            toast.error("Failed to delete menu item. Please try again.");
        } finally {
            setButtonLoading(prev => ({ ...prev, delete: '' }));
        }
    };

    const handleToggleAvailability = async (id: string, currentAvailability: boolean) => {
        try {
            setButtonLoading((prev) => ({ ...prev, toggleAvailability: id }));

            await toggleMenuItemAvailability(id, !currentAvailability);

            const { menuItems: updatedItems, pagination: updatedPagination } = await fetchMenuItemsByUser({
                search: searchTerm,
                page: pagination.currentPage,
                limit: 10
            });

            setMenuItems(updatedItems);
            setPagination(updatedPagination);

            toast.success(
                !currentAvailability
                    ? "Item marked as available"
                    : "Item marked as unavailable"
            );
        } catch (error) {
            console.error("Error toggling availability:", error);
            toast.error("Failed to update item availability. Please try again.");
        } finally {
            setButtonLoading((prev) => ({ ...prev, toggleAvailability: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewItem(prev => ({
                ...prev,
                image: e.target.files![0]
            }));
        }
    };

    const handleStartEdit = (item: Menu) => {
        setEditingItem(item);
        setNewItem({
            name: item.name,
            price: item.price,
            measure: item.measure,
            category: item.category._id,
            image: null
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-4">
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

            <AlertDialog
                open={!!deleteItemId}
                onOpenChange={() => setDeleteItemId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <AlertTriangle className="inline-block mr-2 text-yellow-500" />
                            Are you sure you want to delete this menu item?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove the menu item from your system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteItem}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={buttonLoading.delete !== ''}
                        >
                            {buttonLoading.delete ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full sm:max-w-sm"
                />

                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) {
                            setEditingItem(null)
                            setNewItem({
                                name: "",
                                price: 0,
                                measure: "",
                                category: "",
                                image: null
                            })
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                        >
                            Add Menu Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
                            <DialogDescription>Fill in the details for the menu item.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="sm:text-right text-left">Name</Label>
                                <Input
                                    id="name"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="col-span-1 sm:col-span-3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="sm:text-right text-left">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                                    className="col-span-1 sm:col-span-3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                <Label htmlFor="measure" className="sm:text-right text-left">Measure</Label>
                                <Input
                                    id="measure"
                                    type="text"
                                    value={newItem.measure}
                                    onChange={(e) => setNewItem({ ...newItem, measure: e.target.value })}
                                    className="col-span-1 sm:col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="sm:text-right text-left">Category</Label>
                                <Select
                                    value={newItem.category}
                                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                                    required
                                >
                                    <SelectTrigger className="col-span-1 sm:col-span-3">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger><SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                <Label htmlFor="image" className="sm:text-right text-left">Image</Label>
                                <div className="col-span-1 sm:col-span-3 flex items-center space-x-2">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="flex-grow"
                                    />
                                    {newItem.image && (
                                        <div className="flex items-center space-x-2">
                                            <span>{newItem.image.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setNewItem(prev => ({ ...prev, image: null }))}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={editingItem ? handleEditItem : handleAddItem}
                                disabled={buttonLoading.add || buttonLoading.edit}
                            >
                                {buttonLoading.add || buttonLoading.edit ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {editingItem ? "Updating..." : "Adding..."}
                                    </>
                                ) : (
                                    editingItem ? "Update Item" : "Add Item"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Measure</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {menuItems.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>
                                <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                    className="rounded-md object-cover"
                                />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>{item.category.name}</TableCell>
                            <TableCell>{item.measure}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={item.available}
                                    onCheckedChange={() => handleToggleAvailability(item._id, item.available)}
                                    disabled={buttonLoading.toggleAvailability === item._id}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    className="mr-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => handleStartEdit(item)}
                                    disabled={buttonLoading.edit}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setDeleteItemId(item._id)}
                                    disabled={buttonLoading.delete === item._id}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (pagination.hasPreviousPage) {
                                    handlePageChange(pagination.currentPage - 1);
                                }
                            }}
                            aria-disabled={!pagination.hasPreviousPage || buttonLoading.pagination}
                            className={(!pagination.hasPreviousPage || buttonLoading.pagination) ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {[...Array(pagination.totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(index + 1);
                                }}
                                isActive={pagination.currentPage === index + 1}
                                aria-disabled={buttonLoading.pagination}
                                className={buttonLoading.pagination ? "pointer-events-none opacity-50" : ""}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (pagination.hasNextPage) {
                                    handlePageChange(pagination.currentPage + 1);
                                }
                            }}
                            aria-disabled={!pagination.hasNextPage || buttonLoading.pagination}
                            className={(!pagination.hasNextPage || buttonLoading.pagination) ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <div className="text-center text-sm text-gray-500 mt-2">
                {buttonLoading.pagination ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </div>
                ) : (
                    <>
                        Page {pagination.currentPage} of {pagination.totalPages}
                        {pagination.totalItems > 0 && ` (${pagination.totalItems} total items)`}
                    </>
                )}
            </div>
        </div>
    )
}