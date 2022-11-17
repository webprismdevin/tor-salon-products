import { GridItem, SimpleGrid } from "@chakra-ui/react"

export interface ColumnModuleProps {
    columns: [any]
}

export default function Columns({ data }: { data: ColumnModuleProps}){
    const colNum = data.columns.length;

    return <SimpleGrid templateColumns={`repeat(${colNum}, 1fr)`}>
        {data.columns.map((column) => (
            <GridItem key={column._key} colSpan={[colNum, null, 1]}>
                <div></div>
            </GridItem>
        ))}
    </SimpleGrid>
}