import React, { useState, useEffect } from "react";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import FormDialog from "../../components/dialogs/FormDialog";
import FormTextField from "../../components/forms/FormTextField";

function CompanyForm({ open, onClose, onSubmit, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    email: "",
    phone: "",
    address: "",
    is_active: true,
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        subdomain: initialData.subdomain || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
      });
      setErrors({});
    } else {
      setFormData({
        name: "",
        subdomain: "",
        email: "",
        phone: "",
        address: "",
        is_active: true,
      });
      setErrors({});
    }
  }, [initialData, open]);

  const sanitizeSubdomain = (value) => {
    // Remove any dots, convert to lowercase
    let sanitized = value.toLowerCase();
    // Replace dots with hyphens
    sanitized = sanitized.replace(/\./g, '-');
    // Remove any other invalid characters (keep only letters, numbers, underscores, hyphens)
    sanitized = sanitized.replace(/[^a-z0-9_-]/g, '');
    // Remove leading/trailing hyphens/underscores
    sanitized = sanitized.replace(/^[-_]+|[-_]+$/g, '');
    return sanitized;
  };

  const validateSubdomain = (value) => {
    const slugRegex = /^[a-z0-9_-]+$/;
    if (!value) return "Subdomain is required";
    if (!slugRegex.test(value)) {
      return "Enter a valid \"slug\" consisting of letters, numbers, underscores or hyphens.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for subdomain
    if (name === 'subdomain') {
      const sanitizedValue = sanitizeSubdomain(value);
      const error = validateSubdomain(sanitizedValue);
      
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue,
      }));
      
      setErrors(prev => ({
        ...prev,
        [name]: error || null,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
      
      // Clear any previous error for this field
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null,
        }));
      }
    }
  };

  const handleSubmit = () => {
    // Validate all fields before submission
    const subdomainError = validateSubdomain(formData.subdomain);
    
    if (subdomainError) {
      setErrors({ subdomain: subdomainError });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Edit Company" : "New Company"}
      submitLabel={initialData ? "Update" : "Add"}
      loading={isLoading}
      maxWidth="sm"
    >
      <Grid container spacing={2}>
        {/* Company Name - full width */}
        <Grid size={12}>
          <FormTextField
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            size="small"
            placeholder="Acme Corporation"
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        {/* Subdomain - full width */}
        <Grid size={12}>
          <FormTextField
            label="Subdomain"
            name="subdomain"
            value={formData.subdomain}
            onChange={handleChange}
            required
            size="small"
            placeholder="acme-corp"
            helperText="Enter a valid slug (letters, numbers, underscores, hyphens only). Dots will be converted to hyphens."
            error={!!errors.subdomain}
          />
          {errors.subdomain && (
            <div style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px' }}>
              {errors.subdomain}
            </div>
          )}
        </Grid>

        {/* Email - full width */}
        <Grid size={12}>
          <FormTextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            size="small"
            placeholder="contact@acme.com"
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        {/* Phone - full width */}
        <Grid size={12}>
          <FormTextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            size="small"
            placeholder="+1 (555) 123-4567"
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>

        {/* Address - full width */}
        <Grid size={12}>
          <FormTextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={2}
            size="small"
            placeholder="123 Main St, City, State, ZIP"
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>

        {/* Is Active Checkbox */}
        <Grid size={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Active"
          />
        </Grid>
      </Grid>
    </FormDialog>
  );
}

export default CompanyForm;