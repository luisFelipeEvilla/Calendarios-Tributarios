import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "./table";


const accordionSummaryStyle = {
    backgroundColor: "primary.main",
    color: 'white',
}

const accordionStyle = {
    marginTop: 0.2
}


export default function Accordeon({ ...props }) {
    return (
        <Accordion sx={accordionStyle}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={accordionSummaryStyle}
            >
                <Typography>{props.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                    <Table data={props.data} />
            </AccordionDetails>
        </Accordion>
    )
}