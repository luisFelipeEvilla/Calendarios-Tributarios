import { Scheduler } from "@aldabil/react-scheduler";
import type {
  ProcessedEvent,
  SchedulerHelpers
} from "@aldabil/react-scheduler/types";
import { Button, DialogActions, TextField } from "@mui/material";
import { es as locale } from "date-fns/locale";
import { useState } from "react";

interface CustomEditorProps {
  scheduler: SchedulerHelpers;
}

const config = {
    locale,
    view: 'month'
}

const CustomEditor = ({ scheduler }: CustomEditorProps) => {
  const event = scheduler.edited;
  const [state, setState] = useState({number: event?.title || undefined});
  const [error, setError] = useState("");

  const handleChange = (value: string, name: string) => {
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Your own validation
    const digit = state.number;

    if (digit === undefined || isNaN(+digit) ||  digit < 0) {
      return setError("Debe ingresar un número");
    }

    try {
      scheduler.loading(true);

      const added_updated_event = (await new Promise((res) => {
        setTimeout(() => {
          res({
            event_id: event?.event_id || Math.random(),
            //@ts-ignore
            title: state.number,
            start: scheduler.state.start.value,
            end: scheduler.state.end.value,
            description: ''
          });
        }, 1000);
      })) as ProcessedEvent;

      scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
      scheduler.close();
    } finally {
      scheduler.loading(false);
    }
  };
  return (
    <div>
      <div style={{ padding: "1rem" }}>
        <p>Ingre el digito de verificación</p>
        <TextField
          label="Digito de verificación"
          value={state.number}
          onChange={(e) => handleChange(e.target.value, "number")}
          error={!!error}
          helperText={error}
          fullWidth
        />
      </div>
      <DialogActions>
        <Button onClick={scheduler.close} variant='contained' color='error'>Cancelar</Button>
        <Button onClick={handleSubmit} variant='contained' color='success' >Confirmar</Button>
      </DialogActions>
    </div>
  );
};

function TaxesScheduler({...props}) {
  return (
    <Scheduler
      {...config}      
      customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
      viewerExtraComponent={(fields, event) => {
        return (
          <div>
            <p>Numero de verificación: {event.title}</p>
          </div>
        );
      }}
    />
  );
}

export default TaxesScheduler;
