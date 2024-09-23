import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import DiscountIcon from '@mui/icons-material/Discount';
import DashboardIcon from '@mui/icons-material/Dashboard';


const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});





export default function DashboardLayoutBasic() {
 

  const [pathname, setPathname] = React.useState('/home');




  return (
    // preview-start
    <AppProvider
    navigation={[
        {
            kind: 'header',
            title: 'Main items',
          },
          {
            segment: 'dashboard',
            title: 'Dashboard',
            icon: <DashboardIcon />,
          },
          {
            segment: 'courses',
            title: 'Courses',
            icon: <SchoolIcon />,
            
          },
          {
            segment: 'categories',
            title: 'Categorias',
            icon: <CategoryIcon />,
          },
          {
            segment: 'promoção',
            title: 'Promoção',
            icon: <DiscountIcon />,
          },
          {
            kind: 'divider',
          }
      ]}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'KIAINFO',
      }}
      
     
    >
      <DashboardLayout>
        
      </DashboardLayout>
      
    
    </AppProvider>
    // preview-end
  );
}
