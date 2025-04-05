import React from "react";

// Props:
// - table: the instance of your table (with getFilteredSelectedRowModel)
// - walletAddress: string
// - chain: chain/network id
// - formatAddress, formatDate, getFullAddress, formatValue, getChainName: helper functions

const TransactionPDFGenerator = ({
  table,
  walletAddress,
  chain,
  formatAddress,
  formatDate,
  getFullAddress,
  formatValue,
  getChainName,
}) => {
  const generateBatchPDF = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      alert("Please select at least one transaction");
      return;
    }

    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();

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
      doc.text(`Network: ${getChainName(chain)}`, 105, 50, {
        align: "center",
      });

      doc.setFontSize(14);
      doc.text("Transaction Summary", 20, 60);

      const tableData = selectedRows.map((row) => {
        const tx = row.original;
        return [
          formatAddress(tx.hash),
          formatDate(tx.timestamp),
          formatAddress(tx.from),
          formatAddress(tx.to),
          formatValue(tx.value),
          tx.status === "success" ? "Success" : "Pending",
        ];
      });

      autoTable(doc, {
        startY: 65,
        head: [["Hash", "Date", "From", "To", "Value (ETH)", "Status"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
        },
      });

      let currentY = doc.previousAutoTable.finalY + 20;

      for (let i = 0; i < selectedRows.length; i++) {
        const tx = selectedRows[i].original;

        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(12);
        doc.text(`Transaction ${i + 1} Details`, 20, currentY);

        const txData = [
          ["Hash", tx.hash],
          ["Block", tx.block_number ? tx.block_number.toString() : "N/A"],
          ["Date", formatDate(tx.timestamp)],
          ["From", getFullAddress(tx.from)],
          ["To", getFullAddress(tx.to)],
          ["Value", `${formatValue(tx.value)} ETH`],
          ["Gas Used", tx.gas_used ? tx.gas_used.toString() : "N/A"],
          ["Status", tx.status === "success" ? "Success" : "Pending"],
        ];

        autoTable(doc, {
          startY: currentY + 5,
          body: txData,
          theme: "plain",
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 30, fontStyle: "bold" },
            1: { cellWidth: 150 },
          },
        });

        currentY = doc.previousAutoTable.finalY + 15;
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          "This document serves as proof of the blockchain transactions detailed above.",
          105,
          285,
          { align: "center" },
        );
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      }

      doc.save(`wallet-transactions-${formatAddress(walletAddress)}.pdf`);
    } catch (error) {
      console.error("Failed to generate batch PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <button
      onClick={generateBatchPDF}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
    >
      Generate PDF
    </button>
  );
};

export default TransactionPDFGenerator;
