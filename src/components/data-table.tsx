"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrendingUpIcon,
  SearchIcon,
  WalletIcon,
  FileIcon,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActiveAccount } from "thirdweb/react";
import { getWalletBalance } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

// Replace with your actual client ID
const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

const client = createThirdwebClient({
  clientId: "....",
});

// Transaction schema
const transactionSchema = {
  id: String,
  hash: String,
  timestamp: Number,
  from: String,
  to: String,
  value: String,
  type: String,
  status: String,
};

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Sleep function for delays between retries
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Format timestamp to readable date
const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

// Format address to shorter version
const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Get full address (no shortening)
const getFullAddress = (address) => {
  if (!address) return "";
  return address;
};

// Format value from wei to ETH
const formatValue = (value) => {
  if (!value) return "0";
  // Convert wei to ETH (divide by 10^18)
  const ethValue = parseFloat(value) / 1e18;
  return ethValue.toFixed(4);
};

// Generate PDF for transaction details
const generateTransactionPDF = async (transaction, chainName) => {
  try {
    // Dynamically import jsPDF and autoTable for client-side usage
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Transaction Receipt", 105, 20, { align: "center" });

    // Add logo/header
    doc.setFontSize(10);
    doc.text("Blockchain Transaction Verification", 105, 30, {
      align: "center",
    });

    // Add timestamp
    const currentDate = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Document generated on: ${currentDate}`, 105, 40, {
      align: "center",
    });

    // Add transaction details
    doc.setFontSize(14);
    doc.text("Transaction Details", 20, 50);

    // Transaction data table
    const transactionData = [
      ["Transaction Hash", transaction.hash],
      [
        "Block Number",
        transaction.block_number ? transaction.block_number.toString() : "N/A",
      ],
      ["Date & Time", formatDate(transaction.timestamp)],
      ["From", getFullAddress(transaction.from)],
      ["To", getFullAddress(transaction.to)],
      ["Value", `${formatValue(transaction.value)} ETH`],
      [
        "Gas Used",
        transaction.gas_used ? transaction.gas_used.toString() : "N/A",
      ],
      [
        "Gas Price",
        transaction.gas_price
          ? (parseInt(transaction.gas_price) / 1e9).toFixed(2) + " Gwei"
          : "N/A",
      ],
      ["Status", transaction.status === 1 ? "Success" : "Pending"],
      ["Network", chainName],
    ];

    autoTable(doc, {
      startY: 55,
      head: [],
      body: transactionData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: "bold" },
        1: { cellWidth: 130 },
      },
    });

    // Add verification note
    const yPos = doc.previousAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text("Verification Notes:", 20, yPos);
    doc.setFontSize(10);
    doc.text(
      "This document serves as proof of the blockchain transaction detailed above. " +
        "The information has been directly retrieved from the blockchain and cannot be altered. " +
        "This transaction can be independently verified on any blockchain explorer.",
      20,
      yPos + 10,
      { maxWidth: 170 },
    );

    // Add QR code placeholder (would need a QR code library in production)
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(65, yPos + 30, 80, 80, 3, 3, "FD");
    doc.setFontSize(10);
    doc.text("Scan to verify on blockchain explorer", 105, yPos + 120, {
      align: "center",
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        "This document is for informational purposes only and does not constitute financial advice.",
        105,
        287,
        { align: "center" },
      );
      doc.text(`Page ${i} of ${pageCount}`, 105, 292, { align: "center" });
    }

    // Save the PDF
    doc.save(`transaction-${transaction.hash.substring(0, 10)}.pdf`);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

// Get chain name from ID
const getChainName = (chainId) => {
  const chains = {
    "1": "Ethereum",
    "137": "Polygon",
    "10": "Optimism",
    "42161": "Arbitrum",
    "8453": "Base",
    ethereum: "Ethereum",
    polygon: "Polygon",
    optimism: "Optimism",
    arbitrum: "Arbitrum",
    base: "Base",
  };

  return chains[chainId] || "Unknown Chain";
};

const transactionColumns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "hash",
    header: "Transaction Hash",
    cell: ({ row }) => {
      return (
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {formatAddress(row.original.hash)}
        </Button>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.timestamp)}</div>;
    },
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => {
      return <div>{formatAddress(row.original.from)}</div>;
    },
  },
  {
    accessorKey: "to",
    header: "To",
    cell: ({ row }) => {
      return <div>{formatAddress(row.original.to)}</div>;
    },
  },
  {
    accessorKey: "value",
    header: () => <div className="w-full text-right">Value (ETH)</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">{formatValue(row.original.value)}</div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.type || "Transfer"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
      >
        {row.original.status === "success" ? (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
        ) : (
          <LoaderIcon />
        )}
        {row.original.status || "Confirmed"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>View on Explorer</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              generateTransactionPDF(
                row.original,
                getChainName(row.original.chainId || "ethereum"),
              )
            }
            className="flex items-center"
          >
            Export as PDF Receipt
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Copy Hash</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DraggableRow({ row }: { row: Row<any> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function WalletTransactionsTable() {
  const account = useActiveAccount();
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  // const [walletAddress, setWalletAddress] = React.useState(account?.address);
  // kept it as hard coded as my account didnt have any trnasaction and this acount does
  const [walletAddress, setWalletAddress] = React.useState(
    "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
  );

  const [walletBalance, setWalletBalance] = React.useState(null);
  const [chain, setChain] = React.useState("1");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [retryCount, setRetryCount] = React.useState(0);
  const [retryStatus, setRetryStatus] = React.useState("");
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  // Set wallet address from connected account
  React.useEffect(() => {
    if (account && account.address) {
      setWalletAddress(account.address);
    }
  }, [account]);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!account || !account.address) return;

    try {
      const balance = await getWalletBalance({
        client,
        chain,
        address: account.address,
      });

      setWalletBalance(balance);
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);
    }
  };

  // Fetch transactions with retry logic
  const fetchTransactions = async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);
    setRetryCount(0);
    setRetryStatus("");

    // Define retry delays in milliseconds (20s, 20s, 20s for total ~1min)
    const retryDelays = [20000, 20000, 20000];
    const maxRetries = retryDelays.length;

    try {
      // Check if client ID is available
      if (!THIRDWEB_CLIENT_ID) {
        throw new Error(
          "Missing ThirdWeb client ID. Please check your environment variables.",
        );
      }

      let result = null;
      let retryAttempt = 0;
      let lastError = null;

      while (retryAttempt <= maxRetries) {
        try {
          if (retryAttempt > 0) {
            setRetryStatus(`Retry attempt ${retryAttempt}/${maxRetries}...`);
            // Wait before retrying
            await sleep(retryDelays[retryAttempt - 1]);
          }

          const response = await fetch(
            `https://insight.thirdweb.com/v1/wallets/${walletAddress}/transactions?chain=${chain}`,
            {
              method: "GET",
              headers: {
                "x-client-id": THIRDWEB_CLIENT_ID,
              },
              // Set a longer timeout for the fetch request
              signal: AbortSignal.timeout(60000), // 60 second timeout
            },
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          result = await response.json();

          // If we got here, the request was successful, so break out of the loop
          break;
        } catch (err) {
          lastError = err;
          console.error(`Attempt ${retryAttempt + 1} failed:`, err);
          retryAttempt++;

          // If we've exhausted all retries, throw the last error
          if (retryAttempt > maxRetries) {
            throw lastError;
          }

          setRetryCount(retryAttempt);
        }
      }

      // Transform data for table
      const transformedData = result.data.map((tx, index) => ({
        id: String(index),
        ...tx, // Keep all original API data
        hash: tx.hash,
        timestamp: tx.block_timestamp, // Changed from timestamp to block_timestamp
        from: tx.from_address, // Changed from from to from_address
        to: tx.to_address, // Changed from to to to_address
        value: tx.value,
        type: tx.transaction_type ? `Type ${tx.transaction_type}` : "Transfer",
        status: tx.status === 1 ? "success" : "pending", // Status is a number in the API
        chainId: chain, // Add chain ID for reference in PDF generation
      }));

      setData(transformedData);
      setRetryStatus("");

      // Fetch balance after getting transactions
      fetchWalletBalance();
    } catch (err) {
      console.error("Failed to fetch transactions after all retries:", err);
      setError(
        `Failed to fetch transactions after ${maxRetries} attempts. ${err.message}`,
      );
    } finally {
      setIsLoading(false);
      setRetryCount(0);
      setRetryStatus("");
    }
  };

  // Generate PDF for multiple selected transactions
  // Generate PDF for multiple selected transactions (ONLY selected details)
  const generateBatchPDF = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      alert("Please select at least one transaction to export.");
      return;
    }

    try {
      // Dynamically import jsPDF and autoTable for client-side usage
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();

      // --- Header Information ---
      doc.setFontSize(20);
      doc.text("Transaction Records", 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.text("Blockchain Transaction Verification", 105, 30, {
        align: "center",
      });

      const currentDate = new Date().toLocaleString();
      doc.text(`Document generated on: ${currentDate}`, 105, 40, {
        align: "center",
      });
      doc.text(`Wallet Address: ${walletAddress}`, 105, 45, {
        align: "center",
      });
      doc.text(`Network: ${getChainName(chain)}`, 105, 50, { align: "center" });
      // --- End Header Information ---

      // --- Detailed Section for Each Selected Transaction ---
      let currentY = 65; // Starting Y position after header

      for (let i = 0; i < selectedRows.length; i++) {
        const tx = selectedRows[i].original;

        // Check if we need a new page before adding the next transaction
        // Estimate height needed for a transaction block (adjust as needed)
        const estimatedHeight = 60; // Title + table rows
        if (currentY + estimatedHeight > 280) {
          // Check against page bottom margin
          doc.addPage();
          currentY = 20; // Reset Y position for new page
        }

        doc.setFontSize(12);
        doc.text(
          `Transaction ${i + 1} of ${selectedRows.length} Details`,
          20,
          currentY,
        );

        const txData = [
          ["Transaction Hash", tx.hash],
          [
            "Block Number",
            tx.block_number ? tx.block_number.toString() : "N/A",
          ],
          ["Date & Time", formatDate(tx.timestamp)],
          ["From", getFullAddress(tx.from)],
          ["To", getFullAddress(tx.to)],
          ["Value", `${formatValue(tx.value)} ETH`],
          ["Gas Used", tx.gas_used ? tx.gas_used.toString() : "N/A"],
          [
            "Gas Price",
            tx.gas_price
              ? (parseInt(tx.gas_price) / 1e9).toFixed(2) + " Gwei"
              : "N/A",
          ],
          ["Status", tx.status === "success" ? "Success" : "Pending"],
          ["Network", getChainName(tx.chainId)], // Get chain name from tx data
        ];

        autoTable(doc, {
          startY: currentY + 5,
          body: txData,
          theme: "grid", // Using grid theme for better readability per transaction
          headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // Optional: Style header row if needed
          columnStyles: {
            0: { cellWidth: 40, fontStyle: "bold" },
            1: { cellWidth: 130 },
          },
          didDrawPage: (data) => {
            // Update currentY after table is drawn for correct positioning on the same page
            currentY = data.cursor.y;
          },
        });

        currentY += 15; // Add some space before the next transaction block
      }
      // --- End Detailed Section ---

      // --- Footer Information ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          "This document serves as proof of the blockchain transactions detailed above.",
          105,
          285, // Position footer near the bottom
          { align: "center" },
        );
        doc.text(
          "This document is for informational purposes only and does not constitute financial advice.",
          105,
          290, // Slightly lower
          { align: "center" },
        );
        doc.text(`Page ${i} of ${pageCount}`, 105, 295, { align: "center" }); // Lowest position
      }
      // --- End Footer Information ---

      // Save the PDF
      doc.save(`selected-transactions-${formatAddress(walletAddress)}.pdf`);
    } catch (error) {
      console.error("Failed to generate batch PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Fetch transactions when wallet address changes or chain changes
  React.useEffect(() => {
    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress, chain]);

  const table = useReactTable({
    data,
    columns: transactionColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const handleChangeChain = (value) => {
    setChain(value);
  };

  const handleManualWalletChange = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <div className="w-full space-y-4 p-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4">
        <div className="flex flex-grow items-center gap-2">
          <Label htmlFor="walletAddressInput" className="sr-only">
            Wallet Address
          </Label>
          {/* Using a fixed address for display or the connected one */}
          <Input
            id="walletAddressInput"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)} // Allow manual input if needed
            placeholder="Enter Wallet Address"
            className="h-9 max-w-xs flex-grow"
            disabled={!!account?.address} // Disable if connected
          />
          {/* Manual Fetch Button (Optional if auto-fetch is primary) */}
          {/* <Button onClick={handleManualWalletChange} size="sm" variant="outline" className="h-9">
               <SearchIcon className="mr-2 h-4 w-4" /> Fetch
             </Button> */}
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="chainSelect" className="sr-only">
            Select Chain
          </Label>
          <Select value={chain} onValueChange={handleChangeChain}>
            <SelectTrigger id="chainSelect" className="h-9 w-[150px]">
              <SelectValue placeholder="Select Chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Ethereum</SelectItem>
              <SelectItem value="137">Polygon</SelectItem>
              <SelectItem value="10">Optimism</SelectItem>
              <SelectItem value="42161">Arbitrum</SelectItem>
              <SelectItem value="8453">Base</SelectItem>
              {/* Add other chains as needed */}
            </SelectContent>
          </Select>

          {/* Column Visibility Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Batch Export Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={generateBatchPDF}
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
          >
            Export Selected PDF
          </Button>
        </div>
      </div>

      {/* Optional: Display Wallet Balance */}
      {walletBalance && (
        <div className="text-sm text-muted-foreground">
          Balance ({getChainName(chain)}):{" "}
          {walletBalance.displayValue.substring(0, 6)} {walletBalance.symbol}
        </div>
      )}

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="mr-2 h-5 w-5 animate-spin" />
          <span>Loading transactions... {retryStatus}</span>
        </div>
      )}
      {error && <div className="text-center text-red-500">Error: {error}</div>}

      {/* Table Container */}
      <div className="rounded-md border">
        <DndContext
          key={sortableId} // Use key to ensure context remounts if necessary
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {/* Wrap TableBody content with SortableContext */}
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    // Use the DraggableRow component here
                    <DraggableRow key={row.id} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={transactionColumns.length}
                      className="h-24 text-center"
                    >
                      {isLoading ? "" : "No results."}
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 px-2 sm:flex-row">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
