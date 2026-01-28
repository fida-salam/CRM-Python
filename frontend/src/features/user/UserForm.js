// import React, { useState, useEffect } from "react";
// import { Grid, MenuItem } from "@mui/material";
// import FormDialog from "../../components/dialogs/FormDialog";
// import FormTextField from "../../components/forms/FormTextField";
// import { useAuth } from "../../contexts/AuthContext";

// function UserForm({ open, onClose, onSubmit, initialData, isLoading, companies = [] }) {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     first_name: "",
//     last_name: "",
//     role: "user",
//     phone: "",
//     company_id: "", // ← ADDED COMPANY ID FIELD
//   });

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         username: initialData.username || "",
//         email: initialData.email || "",
//         password: "", // Never pre-fill password
//         first_name: initialData.first_name || "",
//         last_name: initialData.last_name || "",
//         role: initialData.role || "user",
//         phone: initialData.phone || "",
//         company_id: initialData.company_id || initialData.company || "", // Handle both formats
//       });
//     } else {
//       // Set default company for regular admins (their own company)
//       let defaultCompanyId = "";
//       if (user?.role === 'admin' && user?.company_id) {
//         defaultCompanyId = user.company_id;
//       }
      
//       setFormData({
//         username: "",
//         email: "",
//         password: "",
//         first_name: "",
//         last_name: "",
//         role: "user",
//         phone: "",
//         company_id: defaultCompanyId, // Set default company
//       });
//     }
//   }, [initialData, open, user]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = () => {
//     // For updates, only send password if it's filled
//     const submitData = { ...formData };
    
//     // Remove empty password for updates
//     if (initialData && !submitData.password) {
//       delete submitData.password;
//     }
    
//     // Convert company_id to integer
//     if (submitData.company_id) {
//       submitData.company_id = parseInt(submitData.company_id);
//     }
    
//     onSubmit(submitData);
//   };

//   const roleOptions = [
//     { value: "user", label: "User" },
//     { value: "manager", label: "Manager" },
//     { value: "admin", label: "Admin" },
//     { value: "super_admin", label: "Super Admin" },
//   ];

//   // Filter companies based on user role
//   const getFilteredCompanies = () => {
//     if (user?.role === 'super_admin') {
//       return companies; // Super admin sees all companies
//     } else if (user?.role === 'admin') {
//       // Company admin can only see their own company
//       return companies.filter(company => company.id === user.company_id);
//     }
//     return [];
//   };

//   const filteredCompanies = getFilteredCompanies();

//   return (
//     <FormDialog
//       open={open}
//       onClose={onClose}
//       onSubmit={handleSubmit}
//       title={initialData ? "Edit User" : "New User"}
//       submitLabel={initialData ? "Update" : "Create"}
//       loading={isLoading}
//       maxWidth="sm"
//     >
//       <Grid container spacing={2}>
//         {/* Username */}
//         <Grid size={12}>
//           <FormTextField
//             label="Username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             size="small"
//             disabled={!!initialData} // Can't change username when editing
//           />
//         </Grid>

//         {/* First Name and Last Name in one row */}
//         <Grid size={{ xs: 12, sm: 6 }}>
//           <FormTextField
//             label="First Name"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             size="small"
//           />
//         </Grid>
//         <Grid size={{ xs: 12, sm: 6 }}>
//           <FormTextField
//             label="Last Name"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             size="small"
//           />
//         </Grid>

//         {/* Email */}
//         <Grid size={12}>
//           <FormTextField
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             size="small"
//           />
//         </Grid>

//         {/* Company Dropdown - ONLY FOR SUPER ADMINS AND ADMINS */}
//         {(user?.role === 'super_admin' || user?.role === 'admin') && (
//           <Grid size={12}>
//             <FormTextField
//               label="Company"
//               name="company_id"
//               value={formData.company_id}
//               onChange={handleChange}
//               select
//               required
//               size="small"
//               disabled={user?.role === 'admin'} // Company admins can only assign to their company
//             >
//               <MenuItem value="">Select Company</MenuItem>
//               {filteredCompanies.map((company) => (
//                 <MenuItem key={company.id} value={company.id}>
//                   {company.name}
//                 </MenuItem>
//               ))}
//             </FormTextField>
//           </Grid>
//         )}

//         {/* Password */}
//         <Grid size={12}>
//           <FormTextField
//             label={initialData ? "Password (leave blank to keep current)" : "Password"}
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             required={!initialData} // Required only for new users
//             size="small"
//             helperText={initialData ? "Leave blank to keep current password" : "Minimum 6 characters"}
//           />
//         </Grid>

//         {/* Role */}
//         <Grid size={12}>
//           <FormTextField
//             label="Role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             select
//             required
//             size="small"
//             disabled={user?.role !== 'super_admin'} // Only super admin can change roles
//           >
//             {roleOptions.map((option) => {
//               // Restrict role assignment based on current user's role
//               if (user?.role === 'super_admin') {
//                 return (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 );
//               } else if (user?.role === 'admin') {
//                 // Company admins can only assign user/manager roles (not admin or super_admin)
//                 if (option.value !== 'super_admin' && option.value !== 'admin') {
//                   return (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   );
//                 }
//               }
//               return null;
//             })}
//           </FormTextField>
//         </Grid>

//         {/* Phone */}
//         <Grid size={12}>
//           <FormTextField
//             label="Phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             size="small"
//           />
//         </Grid>
//       </Grid>
//     </FormDialog>
//   );
// }

// export default UserForm;

// import React, { useState, useEffect } from "react";
// import { Grid, MenuItem, Chip, Box } from "@mui/material";
// import FormDialog from "../../components/dialogs/FormDialog";
// import FormTextField from "../../components/forms/FormTextField";
// import { useAuth } from "../../contexts/AuthContext";

// function UserForm({ open, onClose, onSubmit, initialData, isLoading, companies = [] }) {
//   const { user: currentUser } = useAuth();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     first_name: "",
//     last_name: "",
//     role: "user",
//     phone: "",
//     company_ids: [], // For super_admin: multiple companies
//     company_id: "",  // For admin/others: single company
//   });

//   useEffect(() => {
//     if (initialData) {
//       // For editing existing user
//       const userCompanies = initialData.companies || [];
//       const companyIds = userCompanies.map(c => c.id);
      
//       setFormData({
//         username: initialData.username || "",
//         email: initialData.email || "",
//         password: "",
//         first_name: initialData.first_name || "",
//         last_name: initialData.last_name || "",
//         role: initialData.current_role || "user",
//         phone: initialData.phone || "",
//         company_ids: companyIds,
//         company_id: initialData.default_company || "",
//       });
//     } else {
//       // For new user
//       const defaultCompanyId = currentUser?.default_company?.id || "";
      
//       setFormData({
//         username: "",
//         email: "",
//         password: "",
//         first_name: "",
//         last_name: "",
//         role: "user",
//         phone: "",
//         company_ids: currentUser?.role === "super_admin" ? [defaultCompanyId] : [],
//         company_id: defaultCompanyId,
//       });
//     }
//   }, [initialData, open, currentUser]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCompanyIdsChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setFormData({
//       ...formData,
//       company_ids: typeof value === 'string' ? value.split(',') : value,
//     });
//   };

//   const handleSubmit = () => {
//     const submitData = { ...formData };
    
//     // Remove empty password for updates
//     if (initialData && !submitData.password) {
//       delete submitData.password;
//     }
    
//     // Prepare data based on user type
//     if (currentUser?.role === "super_admin") {
//       // Super admin sends company_ids (array) and role
//       submitData.company_ids = submitData.company_ids.map(id => parseInt(id));
//       delete submitData.company_id; // Remove single company field
//     } else {
//       // Admin/others send company_id (single) and role
//       submitData.company_id = parseInt(submitData.company_id);
//       delete submitData.company_ids; // Remove multi-company field
//     }
    
//     onSubmit(submitData);
//   };

//   // Get role options based on current user's role
//   const getRoleOptions = () => {
//     const currentUserRole = currentUser?.role || "user";
    
//     if (currentUserRole === "super_admin") {
//       return [
//         { value: "user", label: "User" },
//         { value: "manager", label: "Manager" },
//         { value: "admin", label: "Admin" },
//         { value: "super_admin", label: "Super Admin" },
//       ];
//     } else if (currentUserRole === "admin") {
//       return [
//         { value: "user", label: "User" },
//         { value: "manager", label: "Manager" },
//       ];
//     } else if (currentUserRole === "manager") {
//       return [
//         { value: "user", label: "User" },
//       ];
//     }
//     return [{ value: "user", label: "User" }];
//   };

//   const roleOptions = getRoleOptions();

//   // Check if current user can edit
//   const canEditRole = () => {
//     const currentUserRole = currentUser?.role || "user";
//     return currentUserRole === "super_admin" || currentUserRole === "admin";
//   };

//   return (
//     <FormDialog
//       open={open}
//       onClose={onClose}
//       onSubmit={handleSubmit}
//       title={initialData ? "Edit User" : "New User"}
//       submitLabel={initialData ? "Update" : "Create"}
//       loading={isLoading}
//       maxWidth="sm"
//     >
//       <Grid container spacing={2}>
//         {/* Username */}
//         <Grid size={12}>
//           <FormTextField
//             label="Username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             size="small"
//             disabled={!!initialData}
//           />
//         </Grid>

//         {/* First Name and Last Name */}
//         <Grid size={{ xs: 12, sm: 6 }}>
//           <FormTextField
//             label="First Name"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             size="small"
//           />
//         </Grid>
//         <Grid size={{ xs: 12, sm: 6 }}>
//           <FormTextField
//             label="Last Name"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             size="small"
//           />
//         </Grid>

//         {/* Email */}
//         <Grid size={12}>
//           <FormTextField
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             size="small"
//           />
//         </Grid>

//         {/* Company Selection - DIFFERENT BASED ON USER ROLE */}
//         {currentUser?.role === "super_admin" ? (
//           /* Super Admin: Multi-select for multiple companies */
//           <Grid size={12}>
//             <FormTextField
//               label="Companies (Select multiple)"
//               name="company_ids"
//               value={formData.company_ids}
//               onChange={handleCompanyIdsChange}
//               select
//               SelectProps={{
//                 multiple: true,
//                 renderValue: (selected) => (
//                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                     {selected.map((value) => {
//                       const company = companies.find(c => c.id == value);
//                       return (
//                         <Chip 
//                           key={value} 
//                           label={company?.name || value} 
//                           size="small"
//                         />
//                       );
//                     })}
//                   </Box>
//                 ),
//               }}
//               required
//               size="small"
//             >
//               {companies.map((company) => (
//                 <MenuItem key={company.id} value={company.id}>
//                   {company.name}
//                 </MenuItem>
//               ))}
//             </FormTextField>
//           </Grid>
//         ) : (
//           /* Admin/Manager: Single company (current company only) */
//           <Grid size={12}>
//             <FormTextField
//               label="Company"
//               name="company_id"
//               value={formData.company_id}
//               onChange={handleChange}
//               select
//               required
//               size="small"
//               disabled={!initialData} // Can't change company for existing users
//               helperText={initialData ? "Cannot change company after creation" : "User will be added to this company"}
//             >
//               <MenuItem value="">Select Company</MenuItem>
//               {companies.map((company) => (
//                 <MenuItem key={company.id} value={company.id}>
//                   {company.name}
//                 </MenuItem>
//               ))}
//             </FormTextField>
//           </Grid>
//         )}

//         {/* Password */}
//         <Grid size={12}>
//           <FormTextField
//             label={initialData ? "Password (leave blank to keep current)" : "Password"}
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             required={!initialData}
//             size="small"
//             helperText={initialData ? "Leave blank to keep current password" : "Minimum 6 characters"}
//           />
//         </Grid>

//         {/* Role in Company */}
//         <Grid size={12}>
//           <FormTextField
//             label="Role in Company"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             select
//             required
//             size="small"
//             disabled={!canEditRole()}
//           >
//             {roleOptions.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </FormTextField>
//         </Grid>

//         {/* Phone */}
//         <Grid size={12}>
//           <FormTextField
//             label="Phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             size="small"
//           />
//         </Grid>
//       </Grid>
//     </FormDialog>
//   );
// }

// export default UserForm;

import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Chip, Box } from "@mui/material";
import FormDialog from "../../components/dialogs/FormDialog";
import FormTextField from "../../components/forms/FormTextField";
import { useAuth } from "../../contexts/AuthContext";

function UserForm({ open, onClose, onSubmit, initialData, isLoading, companies = [] }) {
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "user",
    phone: "",
    company_ids: [], // Multi-select for super_admin
  });

  useEffect(() => {
    if (initialData) {
      // For editing: get company IDs from companies array
      const companyIds = initialData.companies ? initialData.companies.map(c => c.id) : [];
      
      setFormData({
        username: initialData.username || "",
        email: initialData.email || "",
        password: "",
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        role: initialData.current_role || "user",
        phone: initialData.phone || "",
        company_ids: companyIds,
      });
    } else {
      // For new user
      const defaultCompanyId = currentUser?.default_company?.id;
      
      setFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "user",
        phone: "",
        company_ids: currentUser?.role === "super_admin" && defaultCompanyId ? [defaultCompanyId] : [],
      });
    }
  }, [initialData, open, currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompanyIdsChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      company_ids: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = () => {
    const submitData = { ...formData };
    
    // Remove empty password for updates
    if (initialData && !submitData.password) {
      delete submitData.password;
    }
    
    // Ensure company_ids is an array of integers
    if (submitData.company_ids && submitData.company_ids.length > 0) {
      submitData.company_ids = submitData.company_ids.map(id => parseInt(id));
    }
    
    onSubmit(submitData);
  };

  // Get role options
  const getRoleOptions = () => {
    const currentUserRole = currentUser?.role || "user";
    
    if (currentUserRole === "super_admin") {
      return [
        { value: "user", label: "User" },
        { value: "manager", label: "Manager" },
        { value: "admin", label: "Admin" },
        { value: "super_admin", label: "Super Admin" },
      ];
    } else if (currentUserRole === "admin") {
      return [
        { value: "user", label: "User" },
        { value: "manager", label: "Manager" },
      ];
    }
    return [{ value: "user", label: "User" }];
  };

  const roleOptions = getRoleOptions();

  // Check if user is super_admin
  const isSuperAdmin = currentUser?.role === "super_admin";

  // Filter companies for non-super admins
  const getAvailableCompanies = () => {
    if (isSuperAdmin) {
      return companies;
    } else {
      // Non-super admins can only use their current company
      return companies.filter(c => c.id === currentUser?.default_company?.id);
    }
  };

  const availableCompanies = getAvailableCompanies();

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Edit User" : "New User"}
      submitLabel={initialData ? "Update" : "Create"}
      loading={isLoading}
      maxWidth="sm"
    >
      <Grid container spacing={2}>
        {/* Username */}
        <Grid size={12}>
          <FormTextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            size="small"
            disabled={!!initialData}
          />
        </Grid>

        {/* Name fields */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            size="small"
          />
        </Grid>

        {/* Email */}
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

        {/* Company Selection - Multi-select for super_admin */}
        <Grid size={12}>
          <FormTextField
            label={isSuperAdmin ? "Companies (Select multiple)" : "Company"}
            name="company_ids"
            value={formData.company_ids}
            onChange={handleCompanyIdsChange}
            select
            SelectProps={{
              multiple: isSuperAdmin,
              renderValue: isSuperAdmin ? (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const company = companies.find(c => c.id == value);
                    return (
                      <Chip 
                        key={value} 
                        label={company?.name || value} 
                        size="small"
                      />
                    );
                  })}
                </Box>
              ) : undefined,
            }}
            required
            size="small"
            disabled={!isSuperAdmin && !!initialData} // Non-super admins can't change company after creation
            helperText={isSuperAdmin ? 
              "Select all companies user should belong to" : 
              (initialData ? "Cannot change company" : "User will be added to this company")
            }
          >
            {availableCompanies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </FormTextField>
        </Grid>

        {/* Password */}
        <Grid size={12}>
          <FormTextField
            label={initialData ? "Password (leave blank to keep current)" : "Password"}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!initialData}
            size="small"
            helperText={initialData ? "Leave blank to keep current password" : "Minimum 6 characters"}
          />
        </Grid>

        {/* Role */}
        <Grid size={12}>
          <FormTextField
            label="Role in Company"
            name="role"
            value={formData.role}
            onChange={handleChange}
            select
            required
            size="small"
            disabled={!isSuperAdmin && currentUser?.role !== "admin"} // Only admins/super_admins can change roles
          >
            {roleOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </FormTextField>
        </Grid>

        {/* Phone */}
        <Grid size={12}>
          <FormTextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            size="small"
          />
        </Grid>
      </Grid>
    </FormDialog>
  );
}

export default UserForm;