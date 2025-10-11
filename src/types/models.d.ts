interface PDFProps {
    _id: number;
    displayName: string;
    pdf: string;
    by: string;
}

interface FieldProps {
    _id: number;
    name: string;
    data: PDFProps[];
}