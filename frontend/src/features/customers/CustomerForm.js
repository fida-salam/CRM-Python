import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import FormDialog from "../../components/dialogs/FormDialog";
import FormTextField from "../../components/forms/FormTextField";

function CustomerForm({ open, onClose, onSubmit, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
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

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Edit Customer" : "New Customer"}
      submitLabel={initialData ? "Update" : "Add"}
      loading={isLoading}
      maxWidth="sm"
    >
      <Grid container spacing={2}>
        {/* First Name and Last Name in one row */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>

        {/* Email - full width row */}
        <Grid size={12}>
          <FormTextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            size="small"
          />
        </Grid>

        {/* Phone - full width row */}
        <Grid size={12}>
          <FormTextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            size="small"
          />
        </Grid>

        {/* Company - full width row */}
        <Grid size={12}>
          <FormTextField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            size="small"
          />
        </Grid>

        {/* Address - full width row */}
        <Grid size={12}>
          <FormTextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={2}
            size="small"
          />
        </Grid>
      </Grid>
    </FormDialog>
  );
}

export default CustomerForm;