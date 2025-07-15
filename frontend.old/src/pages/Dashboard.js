// frontend/src/pages/Dashboard.js
import React from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton,
  Grid, Card, CardContent, Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Dashboard() {
  return (
    <Box>
      {/* Top Nav */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit"><MenuIcon/></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>SigortaTeklif Pro</Typography>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Yeni Teklif</Button>
          <Button color="inherit">Teklifler</Button>
          <Button color="inherit">Müşteriler</Button>
          <Button color="inherit">Analitik</Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {/* Başlık */}
        <Typography variant="h4" gutterBottom>Hoş Geldiniz, Ahmet Bey</Typography>
        <Typography color="text.secondary" mb={4}>
          Bugünkü performansınızı ve teklif durumlarınızı inceleyin
        </Typography>

        {/* Metric Cards */}
        <Grid container spacing={2}>
          {[
            { title: 'Toplam Teklifler', value: '1,247', icon: <DescriptionIcon />, color: 'secondary' },
            { title: 'Bu Ay Satılan', value: '89', delta: '+23%', icon: <TrendingUpIcon /> },
            { title: 'Toplam Prim', value: '₂,456,780', delta: '+8%', icon: <AttachMoneyIcon /> },
            { title: 'Aktif Müşteri', value: '567', delta: '+5%', icon: <PeopleIcon /> },
          ].map((m, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box flexGrow={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {m.title}
                    </Typography>
                    <Typography variant="h5" color={m.color || 'text.primary'}>
                      {m.value}
                    </Typography>
                    {m.delta && (
                      <Typography variant="caption" color="success.main">
                        {m.delta} geçen aya göre
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton color={m.color || 'primary'}>
                      {m.icon}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Hızlı İşlemler */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Hızlı İşlemler</Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Yeni Teklif', icon: <AddIcon />, color: 'primary' },
              { label: 'Teklifleri Görüntüle', icon: <ListAltIcon />, color: 'secondary' },
              { label: 'Performans Analizi', icon: <BarChartIcon />, color: 'info' },
              { label: 'Müşteri Yönetimi', icon: <PeopleIcon />, color: 'success' },
            ].map((f,i)=>(
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={f.icon}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  color={f.color}
                >
                  {f.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Son Teklifler */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Son Teklifler</Typography>
          <Card>
            <CardContent>
              {[{
                car: 'Toyota Corolla (2022)',
                ref: '34 ABC 123',
                customer: 'Mehmet Özkan',
                date: '16.01.2025',
                risk: 'Düşük Risk',
                premium: '₂.450',
                company: 'Anadolu Sigorta'
              }, {
                car: 'Volkswagen Golf (2020)',
                ref: '06 XYZ 789',
                customer: 'Ayşe Demir',
                date: '15.01.2025',
                risk: 'Orta Risk',
                premium: '₺3.200',
                company: 'Aksigorta'
              }].map((q,i)=>(
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  py={1}
                  borderBottom={i===1?0:1}
                  borderColor="divider"
                >
                  <Box>
                    <Typography>{q.car} <Typography component="span" color="text.secondary">{q.ref}</Typography></Typography>
                    <Typography variant="body2">{q.customer}</Typography>
                    <Typography variant="body2" color="text.secondary">{q.date}</Typography>
                    <Typography variant="caption" color={q.risk==='Düşük Risk'?'success.main':'info.main'}>{q.risk}</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h6">{q.premium}</Typography>
                    <Typography variant="body2" color="text.secondary">{q.company}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Alt Bilgiler */}
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">En Çok Sigortalanan</Typography>
                <Typography variant="h6">Toyota Corolla</Typography>
                <Typography variant="caption">Bu ay 24 adet</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Ortalama Süre</Typography>
                <Typography variant="h6">4.2 dk</Typography>
                <Typography variant="caption">Teklif hazırlama</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Dönüşüm Oranı</Typography>
                <Typography variant="h6">%67.8</Typography>
                <Typography variant="caption">Tekliften satışa</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
