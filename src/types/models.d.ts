interface PDFProps {
    _id: number;
    displayName: string;
    pdf: {
        channel: string,
        message: string
    };
    by: string;
}

interface FieldProps {
    _id: number;
    name: string;
    data: PDFProps[];
}