import React, { useState, useEffect } from "react";
import { Grid, MenuItem } from "@mui/material";
import FormDialog from "../../components/dialogs/FormDialog";
import FormTextField from "../../components/forms/FormTextField";

function InteractionForm({ open, onClose, onSubmit, initialData, isLoading, customers }) {
  const [formData, setFormData] = useState({
    customer: "",
    interaction_type: "note",
    subject: "",
    notes: "",
    interaction_date: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        interaction_date: initialData.interaction_date 
          ? new Date(initialData.interaction_date).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      });
    } else {
      setFormData({
        customer: "",
        interaction_type: "note",
        subject: "",
        notes: "",
        interaction_date: new Date().toISOString().slice(0, 16),
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const interactionTypes = [
    { value: 'call', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'note', label: 'Note' },
  ];

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Edit Interaction" : "New Interaction"}
      submitLabel={initialData ? "Update" : "Add"}
      loading={isLoading}
      maxWidth="sm"
    >
      <Grid container spacing={2}>
        {/* Customer Dropdown */}
        <Grid size={12}>
          <FormTextField
            label="Customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            required
            select
            size="small"
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name}
              </MenuItem>
            ))}
          </FormTextField>
        </Grid>

        {/* Interaction Type and Date in one row */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label="Type"
            name="interaction_type"
            value={formData.interaction_type}
            onChange={handleChange}
            required
            select
            size="small"
          >
            {interactionTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </FormTextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label="Date & Time"
            name="interaction_date"
            type="datetime-local"
            value={formData.interaction_date}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>

        {/* Subject - full width */}
        <Grid size={12}>
          <FormTextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>

        {/* Notes - full width */}
        <Grid size={12}>
          <FormTextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={4}
            size="small"
          />
        </Grid>
      </Grid>
    </FormDialog>
  );
}

export default InteractionForm;