import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ComposedChart,
} from "recharts";
import {
  LayoutDashboard, Sparkles, Upload, Truck, Users, Fuel, Wrench, Receipt,
  Building2, FileWarning, Activity, Trophy, FileBarChart, Settings,
  Search, Bell, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Zap, Send, ChevronRight, Gauge, MapPin,
  Calendar, ShieldAlert, Crown, ArrowRight, CircleDot, Lightbulb, Download,
  Filter, Clock, X, Cpu, BadgeCheck, ClipboardList, Image, Eye,
} from "lucide-react";

/* ============================================================
   TEMA
============================================================ */
const T = {
  bg: "#0A0D13", surface: "#10141E", surface2: "#161B28", surface3: "#1C2230",
  border: "#232A3A", borderSoft: "#1A2030", text: "#EAEDF3", textDim: "#8C95AB",
  textFaint: "#5A6276", accent: "#F5B81E", accentSoft: "#3A2F12",
  emerald: "#37D399", emeraldSoft: "#10271F", rose: "#FB6B82", roseSoft: "#2A141B",
  sky: "#4CC2F2", skySoft: "#0F2230", violet: "#A98BF6", cyan: "#34D6C8",
};

const fmtBRL = (n) => (n < 0 ? "-" : "") + "R$ " + Math.abs(Math.round(n)).toLocaleString("pt-BR");
const fmtNum = (n, d = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const MESES = ["Out/25", "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26", "Abr/26"];

/* ============================================================
   DADOS REAIS — Solução Locadora de Toaletes Ltda.
   Fonte: planilhas Veículos, Abastecimentos+Pedágios, Gasto, Motoristas
   Combustível/abastecimento: jan–abr 2026 · Manutenção/multas: abr 2025–abr 2026
============================================================ */
const VEHICLES = [
  { id: "V01", placa: "CVP1962", modelo: "VW/8.120 EURO3", tipo: "Caminhão", ano: 2008, unidade: "Nova Mutum", status: "manutencao", media: 4.98, litros: 1396.1, km: 6901, custoComb: 9085.14, custoManut: 63570.56, custoMultas: 6430.97, pedagio: 309.88, custoTotal: 79396.55, custoKm: 11.51, custoMes: 8182, nAbast: 14, manutAno: 60, nMultas: 22, score: 52, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: "2026-04-30", tacoVenc: "2027-11-13" },
  { id: "V02", placa: "BDX9H60", modelo: "VW/9.170 DRC 4X2", tipo: "Caminhão", ano: 2020, unidade: "Várzea Grande", status: "ativo", media: 4.46, litros: 2363.6, km: 10446, custoComb: 15291.41, custoManut: 55245.33, custoMultas: 5702.38, pedagio: 17.12, custoTotal: 76256.24, custoKm: 7.3, custoMes: 8906, nAbast: 35, manutAno: 37, nMultas: 14, score: 59, licStatus: "A VENCER", licVenc: "2026-11-03", ipvaVenc: "2026-05-29", tacoVenc: "2027-03-18" },
  { id: "V03", placa: "SPI3A99", modelo: "VW/DELIVERY 11.180", tipo: "Caminhão", ano: 2024, unidade: "Várzea Grande", status: "ativo", media: 4.16, litros: 3879.2, km: 16010, custoComb: 25682.38, custoManut: 48501.08, custoMultas: 1107.58, pedagio: 53.68, custoTotal: 75344.72, custoKm: 4.71, custoMes: 10568, nAbast: 56, manutAno: 21, nMultas: 5, score: 74, licStatus: "A VENCER", licVenc: "2026-09-30", ipvaVenc: "2026-05-29", tacoVenc: "2026-08-19" },
  { id: "V04", placa: "BAV6C31", modelo: "VW/8.160 DRC 4X2", tipo: "Caminhão", ano: 2016, unidade: "Sinop", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 65884.88, custoMultas: 1204.59, pedagio: 0.0, custoTotal: 67089.47, custoKm: 0, custoMes: 5590, nAbast: 0, manutAno: 25, nMultas: 8, score: 1, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: "2026-05-29", tacoVenc: "2027-08-07" },
  { id: "V05", placa: "QRD7I51", modelo: "VW/11.180 DRC 4X2", tipo: "Caminhão", ano: 2019, unidade: "Várzea Grande", status: "ativo", media: 5.3, litros: 1723.4, km: 8688, custoComb: 11414.51, custoManut: 42913.11, custoMultas: 10360.65, pedagio: 478.36, custoTotal: 65166.63, custoKm: 7.5, custoMes: 7413, nAbast: 18, manutAno: 25, nMultas: 36, score: 59, licStatus: "PAGO", licVenc: "2026-03-31", ipvaVenc: "2026-04-30", tacoVenc: "2027-06-02" },
  { id: "V06", placa: "QBK1J74", modelo: "FORD/CARGO 816 S", tipo: "Caminhão", ano: 2015, unidade: "Várzea Grande", status: "ativo", media: 6.07, litros: 1641.7, km: 8596, custoComb: 10435.07, custoManut: 37108.48, custoMultas: 8921.41, pedagio: 36.56, custoTotal: 56501.52, custoKm: 6.57, custoMes: 6453, nAbast: 15, manutAno: 36, nMultas: 37, score: 61, licStatus: "VENCIDO", licVenc: "2026-04-30", ipvaVenc: "2026-04-30", tacoVenc: "2027-12-10" },
  { id: "V07", placa: "SPL3D99", modelo: "VW/DELIVERY 11.180", tipo: "Caminhão", ano: 2024, unidade: "Várzea Grande", status: "ativo", media: 4.43, litros: 4528.8, km: 18910, custoComb: 29022.54, custoManut: 24228.07, custoMultas: 878.41, pedagio: 647.16, custoTotal: 54776.18, custoKm: 2.9, custoMes: 9510, nAbast: 64, manutAno: 13, nMultas: 2, score: 80, licStatus: "A VENCER", licVenc: "2026-09-30", ipvaVenc: "2026-05-29", tacoVenc: "2026-09-16" },
  { id: "V08", placa: "BEH6C13", modelo: "VW/6.160 DRC 4X2", tipo: "Caminhão", ano: 2021, unidade: "Sinop", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 42206.03, custoMultas: 3332.02, pedagio: 0.0, custoTotal: 45538.05, custoKm: 0, custoMes: 3795, nAbast: 0, manutAno: 10, nMultas: 17, score: 6, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: "2026-04-30", tacoVenc: "2027-06-18" },
  { id: "V09", placa: "SQE5A87", modelo: "VW/11.180 DRC 4X2", tipo: "Caminhão", ano: 2025, unidade: "Sinop", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 44529.94, custoMultas: 0.0, pedagio: 0.0, custoTotal: 44529.94, custoKm: 0, custoMes: 3711, nAbast: 0, manutAno: 9, nMultas: 0, score: 48, licStatus: "A VENCER", licVenc: "2026-07-31", ipvaVenc: "2026-04-30", tacoVenc: "2027-10-10" },
  { id: "V10", placa: "NVX3C19", modelo: "I/TOYOTA HILUX CS4X4CHAS", tipo: "Caminhonete", ano: 2011, unidade: "Nova Mutum", status: "inativo", media: 0.08, litros: 388.3, km: 18, custoComb: 2539.37, custoManut: 33855.61, custoMultas: 4625.71, pedagio: 258.16, custoTotal: 41278.85, custoKm: 2293.27, custoMes: 3906, nAbast: 7, manutAno: 26, nMultas: 26, score: 0, licStatus: "A VENCER", licVenc: "2026-09-30", ipvaVenc: "2026-05-29", tacoVenc: null },
  { id: "V11", placa: "QCZ3F63", modelo: "I/TOYOTA HILUX CSLSTM4FD", tipo: "Caminhonete", ano: 2019, unidade: "Várzea Grande", status: "ativo", media: 4.92, litros: 731.0, km: 3636, custoComb: 4829.63, custoManut: 26763.77, custoMultas: 0.0, pedagio: 88.9, custoTotal: 31682.3, custoKm: 8.71, custoMes: 3459, nAbast: 16, manutAno: 23, nMultas: 0, score: 40, licStatus: "PAGO", licVenc: "2026-03-31", ipvaVenc: "2026-04-30", tacoVenc: null },
  { id: "V12", placa: "OQB6A99", modelo: "FIAT/STRADA WORKING", tipo: "Pick-Up", ano: 2013, unidade: "Várzea Grande", status: "ativo", media: 8.02, litros: 1114.7, km: 7882, custoComb: 5175.82, custoManut: 18190.67, custoMultas: 5114.21, pedagio: 107.96, custoTotal: 28588.66, custoKm: 3.63, custoMes: 3263, nAbast: 34, manutAno: 26, nMultas: 21, score: 54, licStatus: "A VENCER", licVenc: "2026-09-30", ipvaVenc: "2026-05-29", tacoVenc: null },
  { id: "V13", placa: "KCQ5529", modelo: "M.BENZ/LP 321", tipo: "Caminhão", ano: 1963, unidade: "Várzea Grande", status: "inativo", media: 3.94, litros: 956.6, km: 2983, custoComb: 6187.03, custoManut: 17624.84, custoMultas: 1889.75, pedagio: 107.96, custoTotal: 25809.58, custoKm: 8.65, custoMes: 3200, nAbast: 12, manutAno: 17, nMultas: 8, score: 57, licStatus: "A VENCER", licVenc: "2026-09-30", ipvaVenc: null, tacoVenc: "2027-09-23" },
  { id: "V14", placa: "QTW4D43", modelo: "I/TOYOTA HILUX CSLSTM4FD", tipo: "Caminhonete", ano: 2020, unidade: "Sinop", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 15585.09, custoMultas: 2377.24, pedagio: 0.0, custoTotal: 17962.33, custoKm: 0, custoMes: 1497, nAbast: 0, manutAno: 16, nMultas: 12, score: 0, licStatus: "PAGO", licVenc: "2026-03-31", ipvaVenc: "2026-04-30", tacoVenc: null },
  { id: "V15", placa: "SQB7H12", modelo: "I/FOTON AUMARK S 315L", tipo: "Caminhonete", ano: 2025, unidade: "Várzea Grande", status: "ativo", media: 5.1, litros: 1897.5, km: 9215, custoComb: 12579.28, custoManut: 1525.72, custoMultas: 0.0, pedagio: 0.0, custoTotal: 14105.0, custoKm: 1.53, custoMes: 3272, nAbast: 43, manutAno: 4, nMultas: 0, score: 77, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: "2026-03-31", tacoVenc: null },
  { id: "V16", placa: "RAI5B96", modelo: "VW/11.180 DRC 4X2", tipo: "Caminhão", ano: 2019, unidade: "Sinop", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 13182.17, custoMultas: 0.0, pedagio: 0.0, custoTotal: 13182.17, custoKm: 0, custoMes: 1099, nAbast: 0, manutAno: 28, nMultas: 0, score: 36, licStatus: "A VENCER", licVenc: "2026-06-30", ipvaVenc: "2026-04-30", tacoVenc: "2026-05-03" },
  { id: "V17", placa: "SPO5H53", modelo: "FIAT/STRADA FREEDOM CD13", tipo: "Pick-Up", ano: 2024, unidade: "Nova Mutum", status: "ativo", media: 10.34, litros: 1021.7, km: 9979, custoComb: 4771.15, custoManut: 5944.56, custoMultas: 1224.7, pedagio: 465.76, custoTotal: 12406.17, custoKm: 1.24, custoMes: 1906, nAbast: 26, manutAno: 8, nMultas: 5, score: 81, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: "2026-04-30", tacoVenc: null },
  { id: "V18", placa: "SPZ5D98", modelo: "VW/17.210 CRM 4X2", tipo: "Caminhão", ano: 2025, unidade: "Sinop", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 7876.14, custoMultas: 0.0, pedagio: 0.0, custoTotal: 7876.14, custoKm: 0, custoMes: 656, nAbast: 0, manutAno: 6, nMultas: 0, score: 65, licStatus: "A VENCER", licVenc: "2026-08-31", ipvaVenc: "2026-05-29", tacoVenc: "2027-07-14" },
  { id: "V19", placa: "JYU1A51", modelo: "VW/8.120 EURO3", tipo: "Caminhão", ano: 2007, unidade: "Várzea Grande", status: "ativo", media: 4.4, litros: 1164.2, km: 5105, custoComb: 7753.15, custoManut: 0.0, custoMultas: 0.0, pedagio: 0.0, custoTotal: 7753.15, custoKm: 1.52, custoMes: 1938, nAbast: 12, manutAno: 0, nMultas: 0, score: 100, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: null, tacoVenc: "2027-08-14" },
  { id: "V20", placa: "SPO5H83", modelo: "FIAT/STRADA FREEDOM CD13", tipo: "Pick-Up", ano: 2024, unidade: "Sinop", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 7322.4, custoMultas: 325.39, pedagio: 0.0, custoTotal: 7647.79, custoKm: 0, custoMes: 637, nAbast: 0, manutAno: 4, nMultas: 2, score: 68, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: "2026-04-30", tacoVenc: null },
  { id: "V21", placa: "SQJ0A02", modelo: "VW/DELIVERY 11.180", tipo: "Caminhão", ano: 2025, unidade: "Várzea Grande", status: "ativo", media: 4.03, litros: 1032.6, km: 4021, custoComb: 7319.92, custoManut: 0.0, custoMultas: 0.0, pedagio: 18.28, custoTotal: 7338.2, custoKm: 1.82, custoMes: 1835, nAbast: 18, manutAno: 0, nMultas: 0, score: 100, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: "2027-03-31", tacoVenc: "2026-04-06" },
  { id: "V22", placa: "KAH8I62", modelo: "HONDA/CG 125 FAN", tipo: "Moto", ano: 2007, unidade: "Várzea Grande", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 1182.0, custoMultas: 1302.81, pedagio: 0.0, custoTotal: 2484.81, custoKm: 0, custoMes: 207, nAbast: 0, manutAno: 3, nMultas: 6, score: 57, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: null, tacoVenc: null },
  { id: "V23", placa: "SQJ6B63", modelo: "VW/DELIVERY 11.180", tipo: "Caminhão", ano: 2025, unidade: "Várzea Grande", status: "inativo", media: 0, litros: 0, km: 0, custoComb: 0, custoManut: 0.0, custoMultas: 0.0, pedagio: 18.28, custoTotal: 18.28, custoKm: 0, custoMes: 5, nAbast: 0, manutAno: 0, nMultas: 0, score: 100, licStatus: "PAGO", licVenc: "2027-03-31", ipvaVenc: "2027-03-31", tacoVenc: null }
];

const DRIVERS = [
  { id: "M01", nome: "Jose Eugenio Maciel", cat: "D", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2027-09-21", diasCNH: 489, kmTotal: 19560, media: 4.08, nAbast: 64, litros: 4081.9, score: 100 },
  { id: "M02", nome: "Vicente Ferreira De Oliveira Neto", cat: "AB", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2023-06-27", diasCNH: -1058, kmTotal: 17410, media: 4.53, nAbast: 58, litros: 3873.1, score: 68 },
  { id: "M03", nome: "Felipe De Souza Botelho", cat: "AD", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2033-04-18", diasCNH: 2525, kmTotal: 17014, media: 4.55, nAbast: 65, litros: 3489.3, score: 100 },
  { id: "M04", nome: "Jairo Dos Anjos", cat: "AD", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2025-08-31", diasCNH: -262, kmTotal: 10355, media: 7.12, nAbast: 35, litros: 1842.6, score: 68 },
  { id: "M05", nome: "Krewerson Pereira Leite", cat: "AE", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2031-09-24", diasCNH: 1953, kmTotal: 8895, media: 5.94, nAbast: 33, litros: 1330.1, score: 100 },
  { id: "M06", nome: "Alisson Da Costa Silva", cat: "AD", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2031-05-27", diasCNH: 1833, kmTotal: 7622, media: 5.67, nAbast: 15, litros: 1620.2, score: 100 },
  { id: "M07", nome: "Vanderley Pinto Da Costa", cat: "AD", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2032-04-04", diasCNH: 2146, kmTotal: 7290, media: 4.47, nAbast: 19, litros: 1860.2, score: 100 },
  { id: "M08", nome: "Skeibys Jose Hernandez Rosas", cat: "AE", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2032-01-10", diasCNH: 2061, kmTotal: 5945, media: 4.3, nAbast: 19, litros: 1431.3, score: 100 },
  { id: "M09", nome: "Gabriel Lucca Leite Araujo", cat: "B", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2032-06-08", diasCNH: 2211, kmTotal: 5372, media: 9.37, nAbast: 21, litros: 668.0, score: 100 },
  { id: "M10", nome: "Felipe Kenhiti Almeida Yokoyama", cat: "B", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2034-05-16", diasCNH: 2918, kmTotal: 2570, media: 10.8, nAbast: 13, litros: 585.4, score: 100 },
  { id: "M11", nome: "Mikael De Barros Bueno Bezerra", cat: "AD", unidade: "Outros", status: "ATIVO", vencCNH: "2035-04-10", diasCNH: 3247, kmTotal: 2072, media: 3.93, nAbast: 5, litros: 519.6, score: 100 },
  { id: "M12", nome: "Osmar Freitas Xavier", cat: "nan", unidade: "Várzea Grande", status: "ATIVO", vencCNH: null, diasCNH: null, kmTotal: 1954, media: 6.21, nAbast: 9, litros: 392.1, score: 100 },
  { id: "M13", nome: "Jaqueline Almeida Prado Bescoravane", cat: "AB", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2034-07-30", diasCNH: 2993, kmTotal: 1922, media: 11.5, nAbast: 4, litros: 179.3, score: 100 },
  { id: "M14", nome: "Marcelo Da Silva", cat: "D", unidade: "Outros", status: "ATIVO", vencCNH: "2031-06-20", diasCNH: 1857, kmTotal: 1294, media: 4.68, nAbast: 3, litros: 276.0, score: 100 },
  { id: "M15", nome: "Leonardo Ribeiro De Castro", cat: "B", unidade: "Outros", status: "ATIVO", vencCNH: "2024-12-21", diasCNH: -515, kmTotal: 1212, media: 9.41, nAbast: 4, litros: 130.1, score: 68 },
  { id: "M16", nome: "Motorista Diarista", cat: "nan", unidade: "Outros", status: "ATIVO", vencCNH: null, diasCNH: null, kmTotal: 794, media: 4.51, nAbast: 2, litros: 175.3, score: 100 },
  { id: "M17", nome: "Ademilson Goncalo Da Cunha", cat: "AB", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2033-01-30", diasCNH: 2447, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M18", nome: "Adriano Dos Santos Da Costa", cat: "AD", unidade: "Sinop", status: "ATIVO", vencCNH: "2032-07-30", diasCNH: 2263, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M19", nome: "Ayanderson Ramos Froz", cat: "AE", unidade: "Sinop", status: "ATIVO", vencCNH: "2034-09-16", diasCNH: 3041, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M20", nome: "Carlos Eduardo Sassi", cat: "AD", unidade: "Sinop", status: "ATIVO", vencCNH: "2033-03-27", diasCNH: 2503, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M21", nome: "Danielle Oliveira Mendes", cat: "AB", unidade: "Outros", status: "ATIVO", vencCNH: "2031-10-20", diasCNH: 1979, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M22", nome: "Jose Maria Da Rosa", cat: "AE", unidade: "Sinop", status: "ATIVO", vencCNH: "2025-09-28", diasCNH: -234, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 20 },
  { id: "M23", nome: "Luciney Bento De Oliveira", cat: "nan", unidade: "Outros", status: "ATIVO", vencCNH: null, diasCNH: null, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 0 },
  { id: "M24", nome: "Motorista Experiencia", cat: "nan", unidade: "Sinop", status: "ATIVO", vencCNH: null, diasCNH: null, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 0 },
  { id: "M25", nome: "Randall Wender Fernandes Doril", cat: "AB", unidade: "Sinop", status: "ATIVO", vencCNH: "2033-01-01", diasCNH: 2418, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M26", nome: "Randall Wender Fernandes Dorileo", cat: "AB", unidade: "Sinop", status: "ATIVO", vencCNH: "2032-11-06", diasCNH: 2362, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M27", nome: "Ranielly Goncalina Leite", cat: "B", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2024-11-24", diasCNH: -542, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 20 },
  { id: "M28", nome: "Rodrigo Alves Freitas", cat: "B", unidade: "Várzea Grande", status: "ATIVO", vencCNH: "2033-01-01", diasCNH: 2418, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M29", nome: "Sergio Aires De Lemes", cat: "AB", unidade: "Sinop", status: "ATIVO", vencCNH: "2031-10-12", diasCNH: 1971, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M30", nome: "Tayna Jaqueline Rodrigues De Sousa", cat: "AD", unidade: "Sinop", status: "ATIVO", vencCNH: "2032-03-20", diasCNH: 2131, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 },
  { id: "M31", nome: "Tiago Matos Do Nascimento", cat: "AD", unidade: "Sinop", status: "ATIVO", vencCNH: "2033-06-19", diasCNH: 2587, kmTotal: 0, media: 0, nAbast: 0, litros: 0, score: 100 }
];

const DOCS = [
  { tipo: "CNH", ref: "Vicente Ferreira De Oliveira Neto", venc: "27/06/2023", dias: -1058, status: "vencido" },
  { tipo: "CNH", ref: "Ranielly Goncalina Leite", venc: "24/11/2024", dias: -542, status: "vencido" },
  { tipo: "CNH", ref: "Leonardo Ribeiro De Castro", venc: "21/12/2024", dias: -515, status: "vencido" },
  { tipo: "CNH", ref: "Jairo Dos Anjos", venc: "31/08/2025", dias: -262, status: "vencido" },
  { tipo: "CNH", ref: "Jose Maria Da Rosa", venc: "28/09/2025", dias: -234, status: "vencido" },
  { tipo: "Licenciamento", ref: "QRD7I51", venc: "31/03/2026", dias: -50, status: "vencido" },
  { tipo: "Licenciamento", ref: "QCZ3F63", venc: "31/03/2026", dias: -50, status: "vencido" },
  { tipo: "Licenciamento", ref: "QTW4D43", venc: "31/03/2026", dias: -50, status: "vencido" },
  { tipo: "IPVA", ref: "SQB7H12", venc: "31/03/2026", dias: -50, status: "vencido" },
  { tipo: "Tacógrafo", ref: "SQJ0A02", venc: "06/04/2026", dias: -44, status: "vencido" },
  { tipo: "IPVA", ref: "CVP1962", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "QRD7I51", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "Licenciamento", ref: "QBK1J74", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "QBK1J74", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "BEH6C13", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "SQE5A87", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "QCZ3F63", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "QTW4D43", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "RAI5B96", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "SPO5H53", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "IPVA", ref: "SPO5H83", venc: "30/04/2026", dias: -20, status: "vencido" },
  { tipo: "Tacógrafo", ref: "RAI5B96", venc: "03/05/2026", dias: -17, status: "vencido" },
  { tipo: "IPVA", ref: "BDX9H60", venc: "29/05/2026", dias: 9, status: "critico" },
  { tipo: "IPVA", ref: "SPI3A99", venc: "29/05/2026", dias: 9, status: "critico" },
  { tipo: "IPVA", ref: "BAV6C31", venc: "29/05/2026", dias: 9, status: "critico" },
  { tipo: "IPVA", ref: "SPL3D99", venc: "29/05/2026", dias: 9, status: "critico" },
  { tipo: "IPVA", ref: "NVX3C19", venc: "29/05/2026", dias: 9, status: "critico" },
  { tipo: "IPVA", ref: "OQB6A99", venc: "29/05/2026", dias: 9, status: "critico" },
  { tipo: "IPVA", ref: "SPZ5D98", venc: "29/05/2026", dias: 9, status: "critico" },
  { tipo: "Licenciamento", ref: "RAI5B96", venc: "30/06/2026", dias: 41, status: "alerta" },
  { tipo: "Licenciamento", ref: "SQE5A87", venc: "31/07/2026", dias: 72, status: "ok" },
  { tipo: "Tacógrafo", ref: "SPI3A99", venc: "19/08/2026", dias: 91, status: "ok" },
  { tipo: "Licenciamento", ref: "SPZ5D98", venc: "31/08/2026", dias: 103, status: "ok" },
  { tipo: "Tacógrafo", ref: "SPL3D99", venc: "16/09/2026", dias: 119, status: "ok" },
  { tipo: "Licenciamento", ref: "SPI3A99", venc: "30/09/2026", dias: 133, status: "ok" },
  { tipo: "Licenciamento", ref: "SPL3D99", venc: "30/09/2026", dias: 133, status: "ok" },
  { tipo: "Licenciamento", ref: "NVX3C19", venc: "30/09/2026", dias: 133, status: "ok" },
  { tipo: "Licenciamento", ref: "OQB6A99", venc: "30/09/2026", dias: 133, status: "ok" },
  { tipo: "Licenciamento", ref: "KCQ5529", venc: "30/09/2026", dias: 133, status: "ok" },
  { tipo: "Licenciamento", ref: "BDX9H60", venc: "03/11/2026", dias: 167, status: "ok" },
  { tipo: "Tacógrafo", ref: "BDX9H60", venc: "18/03/2027", dias: 302, status: "ok" },
  { tipo: "Licenciamento", ref: "CVP1962", venc: "31/03/2027", dias: 315, status: "ok" }
];

const SUPPLIERS = [
  { nome: "Comercial Amazonia De Petroleo Eireli", tipo: "Combustível", preco: 6.3, abast: 295, litros: 17372.8, gasto: 109465 },
  { nome: "Posto Amazonia 30", tipo: "Combustível", preco: 6.8, abast: 72, litros: 4936.8, gasto: 33559 },
  { nome: "Posto Gaivota", tipo: "Combustível", preco: 6.51, abast: 41, litros: 2028.5, gasto: 13210 },
  { nome: "Posto Palmeira", tipo: "Combustível", preco: 6.29, abast: 23, litros: 1376.2, gasto: 8655 },
  { nome: "Auto Posto G1", tipo: "Combustível", preco: 6.55, abast: 16, litros: 948.7, gasto: 6213 },
  { nome: "Posto Aguia Branca", tipo: "Combustível", preco: 4.94, abast: 12, litros: 489.8, gasto: 2419 },
  { nome: "Posto Sutil", tipo: "Combustível", preco: 3.1, abast: 17, litros: 575.7, gasto: 1784 },
  { nome: "Posto Sao Cristovao Vi", tipo: "Combustível", preco: 6.82, abast: 3, litros: 235.6, gasto: 1608 },
  { nome: "—", tipo: "Manutenção", preco: null, abast: 18, litros: 0, gasto: 32029 },
  { nome: "Center Diesel", tipo: "Manutenção", preco: null, abast: 7, litros: 0, gasto: 28446 },
  { nome: "Monaco Diesel", tipo: "Manutenção", preco: null, abast: 2, litros: 0, gasto: 14473 },
  { nome: "Tiago Acessorios", tipo: "Manutenção", preco: null, abast: 3, litros: 0, gasto: 4526 },
  { nome: "Automecanica Conquista", tipo: "Manutenção", preco: null, abast: 3, litros: 0, gasto: 4201 },
  { nome: "Claudio Autopeças", tipo: "Manutenção", preco: null, abast: 7, litros: 0, gasto: 2977 }
];

const EXPENSE_CAT = [
  { cat: "Manutenção", valor: 85781, cor: T.accent },
  { cat: "Compra De Peças", valor: 83016, cor: T.rose },
  { cat: "Mão De Obra", valor: 7313, cor: T.sky },
  { cat: "Borracharia", valor: 5245, cor: T.violet },
  { cat: "Guincho", valor: 4720, cor: T.cyan },
  { cat: "Lubrificação", valor: 4467, cor: T.emerald },
  { cat: "Lava Jato", valor: 1630, cor: T.textDim }
];

const VISTORIAS = [{"data":"2026-05-06 15:30:17","unidade":"Várzea Grande","tipo":"Saída Para a Rota","placa":"RAI5B96","km":123,"motorista":"Felipe","ajudantes":"Leonardo","fotos":{"frontal":"https://drive.google.com/open?id=1Ff1PNr4FE5o0cS2yNxr9A97XvcGXJbK9","lateral_motorista":"https://drive.google.com/open?id=1iSYXwM9yszzcw2eyDwsWrXIyokojMjG3","traseira":"https://drive.google.com/open?id=10xPXpYj8-qWw3sWZxCgwRta_7tFpe956","lateral_carona":"https://drive.google.com/open?id=1P895I4uON4odURSr0LfuUyHDc69Zcoh8"},"items":{"parabrisa":"Bom","pneus_dianteiros":"Bom","pneus_traseiros":"Bom","radiador":"Acima do Meio","oleo":"Acima do Meio","freio":"No meio","embreagem":"No meio","pisca":"Funciona","seta_direita":"Funciona","seta_esquerda":"Funciona","farol_baixo":"Não funciona","farol_alto":"Funciona","luz_re":"Funciona","sirene_re":"Funciona","limpador":"Funciona","macaco":"POSSUI","chave_roda":"POSSUI","triangulo":"NÃO POSSUI","documento":"NÃO POSSUI"}},{"data":"2026-05-28 07:22:38","unidade":"Sinop","tipo":"Saída Para a Rota","placa":"BAV6C31","km":347070,"motorista":"Tayná Jaqueline Rodrigues De Sousa","ajudantes":"Victor Guerra","fotos":{"frontal":"https://drive.google.com/open?id=1uq0H8DLaZtwo0mUhKLAX03DwhJuUjWet","lateral_motorista":"https://drive.google.com/open?id=1ExABTwQ_lvYSW1ckw54PTr9nS-2pHh2x","traseira":"https://drive.google.com/open?id=130cPyJ4WBtIeqd7sJYxmjupXCGzgWlAw","lateral_carona":"https://drive.google.com/open?id=1MhOKnJey2fc9-cxNHKlvs7yYYUEA7UuW"},"items":{"parabrisa":"Bom","pneus_dianteiros":"Bom","pneus_traseiros":"Bom","radiador":"Acima do Meio","oleo":"Acima do Meio","freio":"Acima do Meio","embreagem":"Acima do Meio","pisca":"Funciona","seta_direita":"Funciona","seta_esquerda":"Funciona","farol_baixo":"Funciona","farol_alto":"Funciona","luz_re":"Funciona","sirene_re":"Funciona","limpador":"Funciona","macaco":"POSSUI","chave_roda":"POSSUI","triangulo":"POSSUI","documento":"POSSUI"}},{"data":"2026-05-28 07:32:56","unidade":"Sinop","tipo":"Saída Para a Rota","placa":"RAI5B96","km":256422,"motorista":"Ayanderson","ajudantes":"Marcos","fotos":{"frontal":"https://drive.google.com/open?id=1cI32psdKJXUFxxXoR_KhX6XQP0VYKM1o","lateral_motorista":"https://drive.google.com/open?id=1on63Z9ObgX_FztMURb2gzcZc3AoSaL1z","traseira":"https://drive.google.com/open?id=1HcHqgpbW6JSfhDBeC8vJBb84BEtpP3FG","lateral_carona":"https://drive.google.com/open?id=1Suo-lsmSlzoba4T0V9DhguLcSPyvvsE-"},"items":{"parabrisa":"Bom","pneus_dianteiros":"Bom","pneus_traseiros":"Bom","radiador":"No meio","oleo":"No meio","freio":"No meio","embreagem":"No meio","pisca":"Funciona","seta_direita":"Funciona","seta_esquerda":"Funciona","farol_baixo":"Funciona","farol_alto":"Funciona","luz_re":"Funciona","sirene_re":"Funciona","limpador":"Funciona","macaco":"POSSUI","chave_roda":"POSSUI","triangulo":"POSSUI","documento":"POSSUI"}},{"data":"2026-05-28 08:08:46","unidade":"Sinop","tipo":"Saída Para a Rota","placa":"SQE5A87","km":45762,"motorista":"José Maria da Rosa","ajudantes":"Gilberto","fotos":{"frontal":"https://drive.google.com/open?id=1Aj4YihLDQ6lrv81vo3ciAlMcHZdwfZ5Z","lateral_motorista":"https://drive.google.com/open?id=1hoofvFwNOP63nS4AqxujSodOke-CnA5k","traseira":"https://drive.google.com/open?id=15Fr5GQlfB9Uaq0VA9caUPdPTb_7iH7_5","lateral_carona":"https://drive.google.com/open?id=1J5UoIdNCtokPKP7G0jUmkUvrm7j_WARH"},"items":{"parabrisa":"Bom","pneus_dianteiros":"Bom","pneus_traseiros":"Bom","radiador":"Acima do Meio","oleo":"Acima do Meio","freio":"Acima do Meio","embreagem":"Acima do Meio","pisca":"Funciona","seta_direita":"Funciona","seta_esquerda":"Funciona","farol_baixo":"Funciona","farol_alto":"Funciona","luz_re":"Funciona","sirene_re":"Funciona","limpador":"Funciona","macaco":"POSSUI","chave_roda":"POSSUI","triangulo":"POSSUI","documento":"POSSUI"}}];
const MONTHLY = [
  { mes: "Out/25", combustivel: 0, manutencao: 105639, multas: 6849, pedagio: 0, total: 112488 },
  { mes: "Nov/25", combustivel: 0, manutencao: 39649, multas: 3598, pedagio: 0, total: 43247 },
  { mes: "Dez/25", combustivel: 0, manutencao: 37605, multas: 3258, pedagio: 0, total: 40863 },
  { mes: "Jan/26", combustivel: 38339, manutencao: 170686, multas: 293, pedagio: 504, total: 209822 },
  { mes: "Fev/26", combustivel: 42015, manutencao: 98559, multas: 587, pedagio: 584, total: 141745 },
  { mes: "Mar/26", combustivel: 50221, manutencao: 17290, multas: 0, pedagio: 677, total: 68188 },
  { mes: "Abr/26", combustivel: 50919, manutencao: 210, multas: 0, pedagio: 880, total: 52008 }
];

const VISTORIAS = [
  {
    "data": "2026-05-06 15:30:17",
    "unidade": "Várzea Grande",
    "tipo": "Saída Para a Rota",
    "placa": "RAI5B96",
    "km": 123,
    "motorista": "Felipe",
    "ajudantes": "Leonardo",
    "fotos": {
      "frontal": "https://drive.google.com/open?id=1Ff1PNr4FE5o0cS2yNxr9A97XvcGXJbK9",
      "lateral_motorista": "https://drive.google.com/open?id=1iSYXwM9yszzcw2eyDwsWrXIyokojMjG3",
      "traseira": "https://drive.google.com/open?id=10xPXpYj8-qWw3sWZxCgwRta_7tFpe956",
      "lateral_carona": "https://drive.google.com/open?id=1P895I4uON4odURSr0LfuUyHDc69Zcoh8"
    },
    "items": {
      "parabrisa": "Bom",
      "pneus_dianteiros": "Bom",
      "pneus_traseiros": "Bom",
      "radiador": "Acima do Meio",
      "oleo": "Acima do Meio",
      "freio": "No meio",
      "embreagem": "No meio",
      "pisca": "Funciona",
      "seta_direita": "Funciona",
      "seta_esquerda": "Funciona",
      "farol_baixo": "Não funciona",
      "farol_alto": "Funciona",
      "luz_re": "Funciona",
      "sirene_re": "Funciona",
      "limpador": "Funciona",
      "macaco": "POSSUI",
      "chave_roda": "POSSUI",
      "triangulo": "NÃO POSSUI",
      "documento": "NÃO POSSUI"
    }
  },
  {
    "data": "2026-05-28 07:22:38",
    "unidade": "Sinop",
    "tipo": "Saída Para a Rota",
    "placa": "BAV6C31",
    "km": 347070,
    "motorista": "Tayná Jaqueline Rodrigues De Sousa",
    "ajudantes": "Victor Guerra",
    "fotos": {
      "frontal": "https://drive.google.com/open?id=1uq0H8DLaZtwo0mUhKLAX03DwhJuUjWet",
      "lateral_motorista": "https://drive.google.com/open?id=1ExABTwQ_lvYSW1ckw54PTr9nS-2pHh2x",
      "traseira": "https://drive.google.com/open?id=130cPyJ4WBtIeqd7sJYxmjupXCGzgWlAw",
      "lateral_carona": "https://drive.google.com/open?id=1MhOKnJey2fc9-cxNHKlvs7yYYUEA7UuW"
    },
    "items": {
      "parabrisa": "Bom",
      "pneus_dianteiros": "Bom",
      "pneus_traseiros": "Bom",
      "radiador": "Acima do Meio",
      "oleo": "Acima do Meio",
      "freio": "Acima do Meio",
      "embreagem": "Acima do Meio",
      "pisca": "Funciona",
      "seta_direita": "Funciona",
      "seta_esquerda": "Funciona",
      "farol_baixo": "Funciona",
      "farol_alto": "Funciona",
      "luz_re": "Funciona",
      "sirene_re": "Funciona",
      "limpador": "Funciona",
      "macaco": "POSSUI",
      "chave_roda": "POSSUI",
      "triangulo": "POSSUI",
      "documento": "POSSUI"
    }
  },
  {
    "data": "2026-05-28 07:32:56",
    "unidade": "Sinop",
    "tipo": "Saída Para a Rota",
    "placa": "RAI5B96",
    "km": 256422,
    "motorista": "Ayanderson",
    "ajudantes": "Marcos",
    "fotos": {
      "frontal": "https://drive.google.com/open?id=1cI32psdKJXUFxxXoR_KhX6XQP0VYKM1o",
      "lateral_motorista": "https://drive.google.com/open?id=1on63Z9ObgX_FztMURb2gzcZc3AoSaL1z",
      "traseira": "https://drive.google.com/open?id=1HcHqgpbW6JSfhDBeC8vJBb84BEtpP3FG",
      "lateral_carona": "https://drive.google.com/open?id=1Suo-lsmSlzoba4T0V9DhguLcSPyvvsE-"
    },
    "items": {
      "parabrisa": "Bom",
      "pneus_dianteiros": "Bom",
      "pneus_traseiros": "Bom",
      "radiador": "No meio",
      "oleo": "No meio",
      "freio": "No meio",
      "embreagem": "No meio",
      "pisca": "Funciona",
      "seta_direita": "Funciona",
      "seta_esquerda": "Funciona",
      "farol_baixo": "Funciona",
      "farol_alto": "Funciona",
      "luz_re": "Funciona",
      "sirene_re": "Funciona",
      "limpador": "Funciona",
      "macaco": "POSSUI",
      "chave_roda": "POSSUI",
      "triangulo": "POSSUI",
      "documento": "POSSUI"
    }
  },
  {
    "data": "2026-05-28 08:08:46",
    "unidade": "Sinop",
    "tipo": "Saída Para a Rota",
    "placa": "SQE5A87",
    "km": 45762,
    "motorista": "José Maria da Rosa",
    "ajudantes": "Gilberto",
    "fotos": {
      "frontal": "https://drive.google.com/open?id=1Aj4YihLDQ6lrv81vo3ciAlMcHZdwfZ5Z",
      "lateral_motorista": "https://drive.google.com/open?id=1hoofvFwNOP63nS4AqxujSodOke-CnA5k",
      "traseira": "https://drive.google.com/open?id=15Fr5GQlfB9Uaq0VA9caUPdPTb_7iH7_5",
      "lateral_carona": "https://drive.google.com/open?id=1J5UoIdNCtokPKP7G0jUmkUvrm7j_WARH"
    },
    "items": {
      "parabrisa": "Bom",
      "pneus_dianteiros": "Bom",
      "pneus_traseiros": "Bom",
      "radiador": "Acima do Meio",
      "oleo": "Acima do Meio",
      "freio": "Acima do Meio",
      "embreagem": "Acima do Meio",
      "pisca": "Funciona",
      "seta_direita": "Funciona",
      "seta_esquerda": "Funciona",
      "farol_baixo": "Funciona",
      "farol_alto": "Funciona",
      "luz_re": "Funciona",
      "sirene_re": "Funciona",
      "limpador": "Funciona",
      "macaco": "POSSUI",
      "chave_roda": "POSSUI",
      "triangulo": "POSSUI",
      "documento": "POSSUI"
    }
  }
];


const FUEL_LOGS = [
  { data: "04/28", placa: "LKQ1G03", cond: "Vicente Ferreira De Oliv", litros: 83.1, valor: 548, posto: "Comercial Amazonia De Pe", media: 1.2, flag: "alto" },
  { data: "04/28", placa: "OQB6A99", cond: "Leonardo Ribeiro De Cast", litros: 36.6, valor: 175, posto: "Posto Ps", media: 8.11, flag: "ok" },
  { data: "04/28", placa: "QBK1J74", cond: "Alisson Da Costa Silva -", litros: 106.8, valor: 760, posto: "Posto Palmeira", media: 6.16, flag: "ok" },
  { data: "04/28", placa: "QCZ3F63", cond: "Krewerson Pereira Leite ", litros: 62.5, valor: 455, posto: "Posto Gaivota", media: 6.03, flag: "ok" },
  { data: "04/28", placa: "QRD7I51", cond: "Vanderley Pinto Da Costa", litros: 82.2, valor: 592, posto: "Posto Cruzeiro Do Sul", media: 6.35, flag: "ok" },
  { data: "04/28", placa: "SPI3A99", cond: "Mikael De Barros Bueno B", litros: 79.6, valor: 524, posto: "Comercial Amazonia De Pe", media: 3.29, flag: "medio" },
  { data: "04/28", placa: "SPS2B96HB20EYY0G36", cond: "Gabriel Lucca Leite Arau", litros: 217.9, valor: 100, posto: "Posto Sutil", media: 0.87, flag: "alto" },
  { data: "04/28", placa: "SQJ0A02", cond: "Felipe De Souza Botelho ", litros: 59.6, valor: 393, posto: "Comercial Amazonia De Pe", media: 2.22, flag: "alto" },
  { data: "04/28", placa: "SQJ0A02", cond: "Felipe De Souza Botelho ", litros: 9.0, valor: 35, posto: "Comercial Amazonia De Pe", media: 0.0, flag: "ok" },
  { data: "04/27", placa: "FRO2025CARTORESERVA", cond: "Felipe Kenhiti Almeida Y", litros: 63.7, valor: 433, posto: "Posto Gaivota", media: 0.35, flag: "alto" },
  { data: "04/27", placa: "OQB6A99", cond: "Osmar Freitas Xavier - M", litros: 39.9, valor: 183, posto: "Posto Gaivota", media: 7.35, flag: "ok" },
  { data: "04/27", placa: "QCZ3F63", cond: "Krewerson Pereira Leite ", litros: 32.3, valor: 232, posto: "Posto Sao Cristovao Vi", media: 11.37, flag: "ok" },
  { data: "04/27", placa: "SPL3D99", cond: "Skeibys Jose Hernandez R", litros: 84.0, valor: 554, posto: "Posto Amazonia 30", media: 3.61, flag: "medio" },
  { data: "04/26", placa: "OQB6A99", cond: "Leonardo Ribeiro De Cast", litros: 33.5, valor: 159, posto: "Posto Ps", media: 8.2, flag: "ok" }
];

const MAINTENANCE = [
  { data: "04/23", placa: "CVP1962", oficina: "Visari Autopeças", desc: "Pedal Do Acelerador", valor: 210, uni: "Nova Mutum" },
  { data: "03/30", placa: "QBK1J74", oficina: "Center Diesel", desc: "Bujao Selo Motor 58.00Mm 0005050, Junta Coleto", valor: 411, uni: "Várzea Grande" },
  { data: "03/27", placa: "QCZ3F63", oficina: "Lp Cardans", desc: "Cruzeta Meritor, Cruzeta Authomix, Luva Desliz", valor: 938, uni: "Várzea Grande" },
  { data: "03/27", placa: "NVX3C19", oficina: "Claudio Peça / Mecanica Conq", desc: "Serviços Prestados. 01 Serv. Trocar Suporte Do", valor: 305, uni: "Nova Mutum" },
  { data: "03/25", placa: "QBK1J74", oficina: "Center Diesel", desc: "Trocar Oleo E Filtros Motores Leves E Medios P", valor: 962, uni: "Várzea Grande" },
  { data: "03/23", placa: "BAV6C31", oficina: "Claudio Autopeças", desc: "Filtro Secador Ar Apu", valor: 139, uni: "Sinop" },
  { data: "03/23", placa: "SPO5H83", oficina: "Ascia Comercio De Veiculos L", desc: "Troca De Filtros, Oleo, Velas, Limpeza De Bico", valor: 2393, uni: "Sinop" },
  { data: "03/21", placa: "SPO5H83", oficina: "Fiat Ascia", desc: "Substituicao Do Filtro Ar Condicionado - 0.10 ", valor: 1500, uni: "Sinop" },
  { data: "03/20", placa: "KCQ5529", oficina: "Tiago Acessorios", desc: "Palheta 20\" Mbb 1313/1112 Pvc.2097", valor: 90, uni: "Várzea Grande" },
  { data: "03/20", placa: "CVP1962", oficina: "Tiago Acessorios", desc: "Faixa Refletiva Adesiva", valor: 108, uni: "Nova Mutum" },
  { data: "03/20", placa: "BAV6C31", oficina: "Center Diesel", desc: "Trocar Reparo Valvula 4 Vias,;Trocar Reparo Va", valor: 376, uni: "Sinop" },
  { data: "03/19", placa: "CVP1962", oficina: "Visari", desc: "Haste Pedal Acelerador Vw 2000", valor: 210, uni: "Nova Mutum" }
];

const MULTAS = [
  { data: "02/10", placa: "KCQ5529", orgao: "Detran Mt", valor: 587 },
  { data: "01/23", placa: "SPO5H53", orgao: "Detran Mt", valor: 293 },
  { data: "12/30", placa: "SPO5H53", orgao: "Detran Mt", valor: 130 },
  { data: "12/26", placa: "CARRETINHAQBY1C61", orgao: "Detran Mt", valor: 293 },
  { data: "12/21", placa: "SPI3A99", orgao: "Detran Mt", valor: 130 },
  { data: "12/18", placa: "OQB6A99", orgao: "Detran Mt", valor: 293 },
  { data: "12/18", placa: "OQB6A99", orgao: "Detran Mt", valor: 195 },
  { data: "12/18", placa: "QTW4D43", orgao: "Detran Mt", valor: 130 },
  { data: "12/17", placa: "NVX3C19", orgao: "Detran Mt", valor: 130 },
  { data: "12/17", placa: "NVX3C19", orgao: "Detran Mt", valor: 260 }
];

/* ============================================================
   ANALYTICS (scores e custo/km pré-calculados a partir dos dados reais)
============================================================ */
function custoKm(v) { return v.custoKm; }
function vehicleScore(v) { return v.score; }
function band(s) {
  if (s >= 80) return { label: "Excelente", cor: T.emerald, soft: T.emeraldSoft };
  if (s >= 65) return { label: "Bom", cor: T.sky, soft: T.skySoft };
  if (s >= 50) return { label: "Atenção", cor: T.accent, soft: T.accentSoft };
  return { label: "Crítico", cor: T.rose, soft: T.roseSoft };
}
function fleetMetrics() {
  const ativos = VEHICLES.filter((v) => v.status === "ativo").length;
  const manut = VEHICLES.filter((v) => v.status === "manutencao").length;
  const custoTotal = VEHICLES.reduce((a, v) => a + v.custoMes, 0);
  const litros = VEHICLES.reduce((a, v) => a + v.litros, 0);
  const withScore = VEHICLES.filter((v) => v.score > 0);
  const scoreMedio = Math.round(withScore.reduce((a, v) => a + v.score, 0) / Math.max(1, withScore.length));
  const kmTotal = VEHICLES.reduce((a, v) => a + v.km, 0);
  const custoComb = VEHICLES.reduce((a, v) => a + v.custoComb, 0);
  return { ativos, manut, total: VEHICLES.length, custoTotal, litros, scoreMedio, kmTotal, custoComb,
    custoKmFrota: kmTotal > 0 ? +(VEHICLES.reduce((a, v) => a + v.custoTotal, 0) / kmTotal).toFixed(2) : 0 };
}
const docCount = (st) => DOCS.filter((d) => d.status === st).length;

const INSIGHTS = [
  { id: 1, tipo: "Risco", sev: "critica", titulo: "CVP1962 opera com custo/km insustentável", texto: "O VW/8.120 (Nova Mutum) registra R$ 11,51/km — disparado o pior da frota — com 60 lançamentos de manutenção e R$ 63 mil em reparos no período. O custo de posse já superou o de substituição; recomenda-se avaliar a renovação do veículo.", economia: 6800, acao: "Frota", icon: AlertTriangle },
  { id: 2, tipo: "Manutenção", sev: "critica", titulo: "BAV6C31 concentra o maior gasto de manutenção", texto: "O VW/8.160 (Sinop) acumula R$ 65,9 mil em manutenção e 25 ordens no período — o maior da frota. O padrão recorrente indica necessidade de revisão estrutural ou plano de substituição antes que o custo escale.", economia: 0, acao: "Manutenção", icon: Wrench },
  { id: 3, tipo: "Anomalia", sev: "alta", titulo: "Caminhões abaixo da eficiência de referência", texto: "KCQ5529 (3,94 km/L), SQJ0A02 (4,03) e SPI3A99 (4,16) operam abaixo da média de 4,5–5,0 km/L da categoria caminhão. O baixo rendimento eleva o custo de diesel e sugere revisão mecânica e orientação de condução.", economia: 2100, acao: "Combustível", icon: Activity },
  { id: 4, tipo: "Tendência", sev: "alta", titulo: "Combustível cresceu 33% de jan a abr/26", texto: "O gasto com diesel subiu de R$ 38,3 mil (jan) para R$ 50,9 mil (abr), alta de 33% no quadrimestre. O avanço acompanha o aumento de quilometragem; vale monitorar para não comprometer a margem operacional.", economia: 0, acao: "Combustível", icon: TrendingUp },
  { id: 5, tipo: "Economia", sev: "media", titulo: "Concentrar abastecimento nos postos mais baratos", texto: "Entre os postos de alto volume, o Posto Palmeira (R$ 6,29/L) é mais barato que o Posto Amazônia 30 (R$ 6,80/L) — diferença de R$ 0,51/L. Redirecionar o volume para a opção mais barata reduz o custo sem perda operacional.", economia: 2518, acao: "Fornecedores", icon: Fuel },
  { id: 6, tipo: "Compliance", sev: "critica", titulo: "22 documentos vencidos na frota e condutores", texto: "Há 22 vencimentos já expirados entre CNHs, licenciamentos, IPVA e tacógrafos, e mais alguns vencendo em até 15 dias. Veículos e condutores em operação com documentação vencida representam risco de autuação e interdição.", economia: 0, acao: "Documentos", icon: ShieldAlert },
];

function copilotAnswer(q) {
  const t = q.toLowerCase();
  const ranked = VEHICLES.filter((v) => v.custoKm > 0 && v.km > 2000).map((v) => ({ ...v, ck: v.custoKm, sc: v.score }));
  const m = fleetMetrics();
  if (/pior|caro|alto custo|maior custo|custo.*ve|ve.*custo/.test(t)) {
    const p = [...ranked].sort((a, b) => b.ck - a.ck)[0], p2 = [...ranked].sort((a, b) => b.ck - a.ck)[1];
    return `O pior custo operacional é o ${p.modelo} (${p.placa}, ${p.unidade}): R$ ${p.ck}/km, com ${p.manutAno} lançamentos de manutenção e ${fmtBRL(p.custoTotal)} de custo total no período. Em segundo, o ${p2.placa} (R$ ${p2.ck}/km). Recomendo avaliar a substituição do ${p.placa} — o custo de posse já não se justifica.`;
  }
  if (/combust|diesel|abastec|posto|economia/.test(t)) {
    const ps = SUPPLIERS.filter((s) => s.tipo === "Combustível" && s.litros > 1000).sort((a, b) => a.preco - b.preco);
    return `Para reduzir combustível: concentrar volume no ${ps[0].nome} (R$ ${ps[0].preco.toFixed(2)}/L), o mais barato entre os de alto volume. O ${ps[ps.length - 1].nome} cobra R$ ${(ps[ps.length - 1].preco - ps[0].preco).toFixed(2)}/L a mais. Os caminhões KCQ5529, SQJ0A02 e SPI3A99 puxam a média de consumo para baixo (3,9–4,2 km/L) — ganho extra vem de revisão e condução econômica.`;
  }
  if (/fornecedor|oficina|manuten.*forn|melhor posto/.test(t)) {
    const top = [...SUPPLIERS].filter((s) => s.tipo === "Manutenção").sort((a, b) => b.gasto - a.gasto)[0];
    return `Na manutenção, o fornecedor com maior volume é ${top ? top.nome : "—"} (${top ? fmtBRL(top.gasto) : "—"} no período). Vale negociar tabela e prazos com os fornecedores de maior recorrência. Em combustível, os postos de Várzea Grande concentram o volume da matriz.`;
  }
  if (/motorista|condut|km|rod/.test(t)) {
    const top = [...DRIVERS].filter((d) => d.kmTotal > 0).sort((a, b) => b.kmTotal - a.kmTotal).slice(0, 3);
    return `Os condutores com mais quilometragem registrada são ${top.map((d) => d.nome.split(" ")[0] + " (" + fmtNum(d.kmTotal) + " km, " + d.media + " km/L)").join(", ")}. A média de consumo por motorista vem dos abastecimentos. Atenção também às CNHs: há ${DRIVERS.filter((d) => d.diasCNH != null && d.diasCNH < 0).length} vencidas entre os cadastrados.`;
  }
  if (/multa|infra/.test(t)) {
    return `As multas somam ${fmtBRL(MONTHLY.reduce((a, x) => a + x.multas, 0))} no período coberto, com pico em ago/25. Vale cruzar as autuações com os condutores responsáveis para ações de orientação e contestação dentro do prazo.`;
  }
  if (/aumentou|cresceu|subiu|tend|despesa.*cresc|mes/.test(t)) {
    const a = MONTHLY[MONTHLY.length - 1], b = MONTHLY[MONTHLY.length - 2];
    return `No último mês (${a.mes}) o custo total foi ${fmtBRL(a.total)} vs. ${fmtBRL(b.total)} no anterior. O combustível vem em trajetória de alta no quadrimestre (+33% de jan a abr). A manutenção oscila bastante mês a mês, concentrada em poucos veículos antigos.`;
  }
  if (/resumo|panorama|visao geral|geral|executivo/.test(t)) {
    return `Resumo executivo\n• Frota com custo registrado: ${m.total} veículos, ${m.manut} com manutenção recente\n• Custo/km médio da frota: R$ ${m.custoKmFrota}\n• Combustível em alta (+33% no quadrimestre)\n• Manutenção concentrada em CVP1962 e BAV6C31\n• Compliance: 22 documentos vencidos — prioridade imediata\nPrioridades: renovar CVP1962, regularizar documentação e padronizar abastecimento.`;
  }
  if (/score|nota|ranking|melhor ve/.test(t)) {
    const bv = [...ranked].sort((a, b) => b.sc - a.sc)[0];
    return `O melhor score da frota é o ${bv.modelo} (${bv.placa}) — ${bv.sc}/100, com R$ ${bv.ck}/km. É um bom benchmark para a categoria ${bv.tipo}.`;
  }
  if (/manuten|preventiv|quebr|reparo/.test(t)) {
    return `A manutenção soma ${fmtBRL(VEHICLES.reduce((a, v) => a + v.custoManut, 0))} no período. Os maiores ofensores são BAV6C31 (${fmtBRL(65885)}, 25 ordens) e CVP1962 (${fmtBRL(63571)}, 60 lançamentos). São fortes candidatos a um plano de substituição ou revisão estrutural.`;
  }
  return `Posso analisar custo por veículo, consumo e economia de combustível, quilometragem de motoristas, multas, fornecedores, tendências de despesa e manutenção. Tente: "qual o veículo mais caro?", "onde reduzir combustível?" ou "resumo executivo".`;
}
const COPILOT_SUGGESTIONS = [
  "Qual o veículo com pior custo operacional?",
  "Onde posso reduzir custos de combustível?",
  "Quais condutores rodam mais?",
  "Quanto gastamos com multas?",
  "Me dê um resumo executivo",
];

/* ============================================================
   PRIMITIVOS UI
============================================================ */
const Card = ({ children, style, pad = 20, onClick, hover }) => {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: T.surface, border: `1px solid ${h && hover ? T.border : T.borderSoft}`, borderRadius: 16, padding: pad, transition: "border-color .2s, transform .2s", cursor: onClick ? "pointer" : "default", transform: h && hover ? "translateY(-2px)" : "none", ...style }}>
      {children}
    </div>
  );
};
const Badge = ({ children, cor, soft }) => (
  <span style={{ background: soft, color: cor, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, letterSpacing: 0.2, whiteSpace: "nowrap" }}>{children}</span>
);
const Dot = ({ cor }) => <span style={{ width: 7, height: 7, borderRadius: 99, background: cor, display: "inline-block" }} />;
const SectionTitle = ({ icon: Icon, children, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      {Icon && <Icon size={16} color={T.textDim} />}
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: 0.2 }}>{children}</h3>
    </div>
    {right}
  </div>
);

const KPI = ({ label, value, delta, deltaGood, sub, icon: Icon, accent }) => (
  <Card pad={18} hover>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ fontSize: 12, color: T.textDim, fontWeight: 500 }}>{label}</div>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: (accent || T.accent) + "1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={15} color={accent || T.accent} />
      </div>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: T.text, marginTop: 10, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: -0.5 }}>{value}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7 }}>
      {delta != null && (
        <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600, color: deltaGood ? T.emerald : T.rose }}>
          {deltaGood ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{delta}
        </span>
      )}
      <span style={{ fontSize: 11.5, color: T.textFaint }}>{sub}</span>
    </div>
  </Card>
);

const TT = ({ active, payload, label, fmt }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: T.surface3, border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 12px", fontSize: 12 }}>
      <div style={{ color: T.textDim, marginBottom: 5, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: T.text, marginTop: 2 }}>
          <Dot cor={p.color || p.fill} /><span style={{ color: T.textDim }}>{p.name}:</span>
          <span style={{ fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>{fmt ? fmt(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const ScoreRing = ({ value, size = 64, stroke = 6 }) => {
  const b = band(value); const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.surface3} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={b.cor} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (value / 100) * c} style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 700, color: b.cor, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</span>
      </div>
    </div>
  );
};

/* ============================================================
   COPILOTO (componente compartilhado)
============================================================ */
function CopilotChat({ compact }) {
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Sou seu copiloto operacional. Posso explicar custos, apontar veículos problemáticos e mapear economia. O que deseja analisar?" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  const send = (text) => {
    const q = (text ?? input).trim(); if (!q) return;
    setMsgs((m) => [...m, { role: "user", text: q }]); setInput(""); setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, { role: "ai", text: copilotAnswer(q) }]); setTyping(false); }, 650);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 4 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "ai" && <div style={{ width: 26, height: 26, borderRadius: 8, background: T.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0 }}><Sparkles size={14} color={T.accent} /></div>}
            <div style={{ maxWidth: "82%", background: m.role === "user" ? T.accent : T.surface2, color: m.role === "user" ? "#0A0D13" : T.text, padding: "10px 13px", borderRadius: 12, fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-line", border: m.role === "ai" ? `1px solid ${T.borderSoft}` : "none", fontWeight: m.role === "user" ? 600 : 400 }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: T.accent + "22", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={14} color={T.accent} /></div>
            <div style={{ display: "flex", gap: 4, padding: "12px 14px", background: T.surface2, borderRadius: 12, border: `1px solid ${T.borderSoft}` }}>
              {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 99, background: T.textDim, animation: `blink 1.2s ${i * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "12px 0" }}>
        {COPILOT_SUGGESTIONS.slice(0, compact ? 3 : 5).map((s, i) => (
          <button key={i} onClick={() => send(s)} style={{ background: T.surface2, border: `1px solid ${T.borderSoft}`, color: T.textDim, fontSize: 11.5, padding: "6px 10px", borderRadius: 18, cursor: "pointer" }}>{s}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "6px 6px 6px 14px" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Pergunte ao copiloto..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: T.text, fontSize: 13 }} />
        <button onClick={() => send()} style={{ width: 34, height: 34, borderRadius: 9, background: T.accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Send size={15} color="#0A0D13" /></button>
      </div>
    </div>
  );
}

/* ============================================================
   VIEWS
============================================================ */
function Dashboard({ go }) {
  const m = fleetMetrics();
  const ranked = VEHICLES.filter((v) => v.custoKm > 0 && v.km > 2000).map((v) => ({ ...v, ck: v.custoKm, sc: v.score })).sort((a, b) => b.ck - a.ck);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <KPI label="Custo total da frota" value={fmtBRL(MONTHLY.reduce((a, x) => a + x.total, 0))} sub="período registrado" icon={Receipt} accent={T.rose} />
        <KPI label="Custo por km (frota)" value={`R$ ${m.custoKmFrota}`} sub="média ponderada" icon={Gauge} accent={T.accent} />
        <KPI label="Score médio da frota" value={`${m.scoreMedio}/100`} sub="eficiência operacional" icon={Trophy} accent={T.emerald} />
        <KPI label="Veículos com registro" value={`${m.total}`} sub={`${m.manut} com manut. recente`} icon={Truck} accent={T.sky} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
        <Card>
          <SectionTitle icon={TrendingUp} right={<Badge cor={T.rose} soft={T.roseSoft}>+33% combustível</Badge>}>Evolução de custos operacionais</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={MONTHLY} margin={{ left: -10, right: 6, top: 6 }}>
              <defs>
                <linearGradient id="gComb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.accent} stopOpacity={0.35} /><stop offset="100%" stopColor={T.accent} stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderSoft} vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: T.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TT fmt={fmtBRL} />} />
              <Area type="monotone" dataKey="combustivel" name="Combustível" stroke={T.accent} fill="url(#gComb)" strokeWidth={2} />
              <Bar dataKey="manutencao" name="Manutenção" fill={T.rose} radius={[3, 3, 0, 0]} barSize={14} />
              <Line type="monotone" dataKey="total" name="Total" stroke={T.sky} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ display: "flex", flexDirection: "column" }}>
          <SectionTitle icon={Sparkles}>Insights da IA</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {INSIGHTS.slice(0, 3).map((ins) => {
              const sev = ins.sev === "critica" ? T.rose : ins.sev === "alta" ? T.accent : T.sky;
              return (
                <div key={ins.id} onClick={() => go("ai")} style={{ background: T.surface2, borderRadius: 12, padding: 13, border: `1px solid ${T.borderSoft}`, borderLeft: `3px solid ${sev}`, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <ins.icon size={13} color={sev} /><span style={{ fontSize: 11, fontWeight: 600, color: sev, textTransform: "uppercase", letterSpacing: 0.4 }}>{ins.tipo}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: T.text, fontWeight: 600, lineHeight: 1.4 }}>{ins.titulo}</div>
                  {ins.economia > 0 && <div style={{ fontSize: 11.5, color: T.emerald, marginTop: 5, fontWeight: 600 }}>↓ economia de {fmtBRL(ins.economia)}/mês</div>}
                </div>
              );
            })}
          </div>
          <button onClick={() => go("ai")} style={{ marginTop: 12, background: "transparent", border: `1px solid ${T.border}`, color: T.textDim, padding: "9px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>Ver todos os 6 insights <ArrowRight size={13} /></button>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <Card>
          <SectionTitle icon={Crown} right={<button onClick={() => go("fleet")} style={{ background: "transparent", border: "none", color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Ver frota →</button>}>Ranking inteligente da frota — custo/km</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ranked.slice(0, 6).map((v, i) => {
              const b = band(v.sc);
              return (
                <div key={v.id} onClick={() => go("fleet", v.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 10, cursor: "pointer", borderBottom: i < 5 ? `1px solid ${T.borderSoft}` : "none" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i < 2 ? T.rose : T.textFaint, width: 18, fontFamily: "'IBM Plex Mono', monospace" }}>{i + 1}º</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{v.placa} <span style={{ color: T.textFaint, fontWeight: 400 }}>· {v.tipo}</span></div>
                    <div style={{ fontSize: 11.5, color: T.textDim }}>{v.modelo}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: i < 2 ? T.rose : T.text, fontFamily: "'IBM Plex Mono', monospace" }}>R$ {v.ck}</div>
                    <div style={{ fontSize: 10.5, color: T.textFaint }}>por km</div>
                  </div>
                  <Badge cor={b.cor} soft={b.soft}>{v.sc}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ display: "flex", flexDirection: "column" }}>
          <SectionTitle icon={FileWarning} right={<Badge cor={T.rose} soft={T.roseSoft}>{docCount("vencido")} vencidos</Badge>}>Documentos vencendo</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {DOCS.slice(0, 5).map((d, idx) => {
              const c = d.status === "vencido" || d.status === "critico" ? T.rose : d.status === "alerta" ? T.accent : T.emerald;
              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Dot cor={c} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: T.text, fontWeight: 500 }}>{d.tipo} · {d.ref}</div>
                    <div style={{ fontSize: 11, color: T.textFaint }}>{d.venc}</div>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: c }}>{d.dias}d</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => go("docs")} style={{ marginTop: "auto", paddingTop: 12, background: "transparent", border: "none", color: T.textDim, fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 5 }}>Gestão de compliance <ChevronRight size={13} /></button>
        </Card>
      </div>
    </div>
  );
}

function AIInsights() {
  const totalEcon = INSIGHTS.reduce((a, i) => a + i.economia, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card style={{ background: `linear-gradient(135deg, ${T.surface2}, ${T.surface})`, borderColor: T.border }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: T.accent + "22", display: "flex", alignItems: "center", justifyContent: "center" }}><Cpu size={22} color={T.accent} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Motor de Inteligência Operacional</div>
            <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 2 }}>{INSIGHTS.length} insights gerados · análise de {VEHICLES.length} veículos, {DRIVERS.length} motoristas e dados de combustível, manutenção e multas</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.emerald, fontFamily: "'IBM Plex Mono', monospace" }}>{fmtBRL(totalEcon)}</div>
            <div style={{ fontSize: 11.5, color: T.textDim }}>economia potencial mapeada</div>
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 14 }}>
        {INSIGHTS.map((ins) => {
          const sev = ins.sev === "critica" ? T.rose : ins.sev === "alta" ? T.accent : T.sky;
          const soft = ins.sev === "critica" ? T.roseSoft : ins.sev === "alta" ? T.accentSoft : T.skySoft;
          return (
            <Card key={ins.id} hover>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: soft, display: "flex", alignItems: "center", justifyContent: "center" }}><ins.icon size={16} color={sev} /></div>
                  <Badge cor={sev} soft={soft}>{ins.tipo} · {ins.sev}</Badge>
                </div>
                {ins.economia > 0 && <Badge cor={T.emerald} soft={T.emeraldSoft}>↓ {fmtBRL(ins.economia)}</Badge>}
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text, lineHeight: 1.35, marginBottom: 8 }}>{ins.titulo}</div>
              <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.6 }}>{ins.texto}</div>
              <div style={{ marginTop: 13, paddingTop: 13, borderTop: `1px solid ${T.borderSoft}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11.5, color: T.textFaint }}>Módulo: {ins.acao}</span>
                <button style={{ background: sev + "1A", border: "none", color: sev, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>Aplicar ação</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function CopilotPage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, height: "calc(100vh - 150px)" }}>
      <Card style={{ display: "flex", flexDirection: "column" }}>
        <SectionTitle icon={Sparkles} right={<Badge cor={T.emerald} soft={T.emeraldSoft}>● online</Badge>}>Copiloto Executivo</SectionTitle>
        <div style={{ flex: 1, minHeight: 0 }}><CopilotChat /></div>
      </Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <SectionTitle icon={Lightbulb}>O que posso fazer</SectionTitle>
          {["Explicar aumentos de custo", "Apontar veículos problemáticos", "Comparar veículos semelhantes", "Resumo executivo mensal", "Oportunidades de economia", "Tendências da frota"].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: i < 5 ? `1px solid ${T.borderSoft}` : "none" }}>
              <CheckCircle2 size={15} color={T.emerald} /><span style={{ fontSize: 12.5, color: T.textDim }}>{c}</span>
            </div>
          ))}
        </Card>
        <Card style={{ background: `linear-gradient(135deg,${T.accentSoft},${T.surface})` }}>
          <div style={{ fontSize: 12, color: T.accent, fontWeight: 600, marginBottom: 6 }}>DICA</div>
          <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.6 }}>O copiloto cruza dados de combustível, manutenção e telemetria em tempo real. Quanto mais específica a pergunta, mais acionável a resposta.</div>
        </Card>
      </div>
    </div>
  );
}

function ImportCenter() {
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);
  const run = () => {
    setStage("processing"); setProgress(0);
    const iv = setInterval(() => setProgress((p) => { if (p >= 100) { clearInterval(iv); setStage("done"); return 100; } return p + 8; }), 90);
  };
  const history = [
    { arq: "abastecimentos_maio.xlsx", reg: 247, status: "ok", data: "18/05 14:22" },
    { arq: "manutencao_q2.xlsx", reg: 63, status: "ok", data: "15/05 09:10" },
    { arq: "telemetria_frota.xlsx", reg: 1842, status: "ok", data: "12/05 17:45" },
    { arq: "motoristas_cnh.xlsx", reg: 12, status: "aviso", data: "10/05 11:30" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18 }}>
        <Card>
          <SectionTitle icon={Upload}>Importar planilha Excel</SectionTitle>
          <div onClick={stage === "idle" || stage === "done" ? run : undefined}
            style={{ border: `2px dashed ${stage === "processing" ? T.accent : T.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", cursor: "pointer", background: T.surface2, transition: "border-color .3s" }}>
            {stage === "idle" && (<><Upload size={34} color={T.textDim} style={{ marginBottom: 12 }} /><div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>Arraste o arquivo .xlsx ou clique para selecionar</div><div style={{ fontSize: 12, color: T.textFaint, marginTop: 6 }}>Abastecimento · Manutenção · Motoristas · Telemetria</div></>)}
            {stage === "processing" && (<><div style={{ fontSize: 14, color: T.accent, fontWeight: 600, marginBottom: 14 }}>Processando e validando dados... {progress}%</div><div style={{ height: 8, background: T.surface3, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", width: `${progress}%`, background: T.accent, transition: "width .1s" }} /></div><div style={{ fontSize: 11.5, color: T.textFaint, marginTop: 10 }}>Mapeando colunas → normalizando placas → cruzando com a frota</div></>)}
            {stage === "done" && (<><CheckCircle2 size={34} color={T.emerald} style={{ marginBottom: 12 }} /><div style={{ fontSize: 14, color: T.emerald, fontWeight: 600 }}>247 registros importados e validados</div><div style={{ fontSize: 12, color: T.textDim, marginTop: 6 }}>Dashboards atualizados automaticamente · 2 avisos de inconsistência</div></>)}
          </div>
          {stage === "done" && (
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[{ l: "Registros", v: "247" }, { l: "Validados", v: "245" }, { l: "Avisos", v: "2" }].map((s, i) => (
                <div key={i} style={{ background: T.surface2, borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: i === 2 ? T.accent : T.text, fontFamily: "'IBM Plex Mono', monospace" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: T.textFaint }}>{s.l}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <SectionTitle icon={BadgeCheck}>Mapeamento automático</SectionTitle>
          {[["Placa", "→ frota.placa", T.emerald], ["Combustível", "→ abastecimento.produto", T.emerald], ["Litros / Valor", "→ custo.combustível", T.emerald], ["KM odômetro", "→ veículo.km", T.emerald], ["Posto", "→ fornecedor", T.accent], ["Motorista", "→ condutor (fuzzy)", T.accent]].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < 5 ? `1px solid ${T.borderSoft}` : "none" }}>
              <span style={{ fontSize: 12.5, color: T.text, fontWeight: 500 }}>{r[0]}</span>
              <span style={{ fontSize: 12, color: T.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>{r[1]}</span>
              <Dot cor={r[2]} />
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <SectionTitle icon={Clock}>Histórico de importações</SectionTitle>
        <Table cols={["Arquivo", "Registros", "Status", "Data"]} rows={history.map((h) => [
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}>{h.arq}</span>,
          fmtNum(h.reg), <Badge cor={h.status === "ok" ? T.emerald : T.accent} soft={h.status === "ok" ? T.emeraldSoft : T.accentSoft}>{h.status === "ok" ? "Concluído" : "Com avisos"}</Badge>, h.data,
        ])} />
      </Card>
    </div>
  );
}

const Table = ({ cols, rows, align }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr>{cols.map((c, i) => <th key={i} style={{ textAlign: align?.[i] || (i === 0 ? "left" : "left"), fontSize: 11, color: T.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, padding: "0 12px 12px", whiteSpace: "nowrap" }}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, ri) => (<tr key={ri} style={{ borderTop: `1px solid ${T.borderSoft}` }}>{r.map((cell, ci) => <td key={ci} style={{ padding: "12px", fontSize: 13, color: T.text, textAlign: align?.[ci] || "left" }}>{cell}</td>)}</tr>))}</tbody>
    </table>
  </div>
);

function Fleet({ selected, go }) {
  const [filter, setFilter] = useState("todos");
  if (selected) return <VehicleDetail id={selected} go={go} />;
  const list = VEHICLES.map((v) => ({ ...v, ck: custoKm(v), sc: vehicleScore(v) }))
    .filter((v) => filter === "todos" || (filter === "ativo" && v.status === "ativo") || (filter === "manut" && v.status === "manutencao") || (filter === "criticos" && v.sc < 55))
    .sort((a, b) => b.ck - a.ck);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[["todos", "Todos"], ["ativo", "Ativos"], ["manut", "Em manutenção"], ["criticos", "Score crítico"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ background: filter === k ? T.accent : T.surface2, color: filter === k ? "#0A0D13" : T.textDim, border: `1px solid ${filter === k ? T.accent : T.borderSoft}`, padding: "8px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
        {list.map((v) => {
          const b = band(v.sc);
          return (
            <Card key={v.id} hover onClick={() => go("fleet", v.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'IBM Plex Mono', monospace" }}>{v.placa}</div>
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{v.modelo}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7 }}>
                    <Badge cor={T.textDim} soft={T.surface3}>{v.tipo}</Badge>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: T.textFaint }}><MapPin size={11} />{v.unidade}</span>
                  </div>
                </div>
                <ScoreRing value={v.sc} size={56} stroke={5} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.borderSoft}` }}>
                <Metric label="Custo/km" value={`R$ ${v.ck}`} cor={v.ck > 3.5 ? T.rose : T.text} />
                <Metric label="Consumo" value={v.media > 0 ? `${v.media} km/L` : "—"} />
                <Metric label="KM (período)" value={v.km > 0 ? `${(v.km / 1000).toFixed(1)}k` : "—"} />
              </div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Badge cor={v.status === "ativo" ? T.emerald : v.status === "manutencao" ? T.accent : T.textFaint} soft={v.status === "ativo" ? T.emeraldSoft : v.status === "manutencao" ? T.accentSoft : T.surface3}>{v.status === "ativo" ? "● Operacional" : v.status === "manutencao" ? "● Manut. recente" : "● Sem registro"}</Badge>
                <span style={{ fontSize: 12, color: b.cor, fontWeight: 600 }}>{b.label}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
const Metric = ({ label, value, cor }) => (
  <div><div style={{ fontSize: 14, fontWeight: 700, color: cor || T.text, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div><div style={{ fontSize: 10.5, color: T.textFaint, marginTop: 1 }}>{label}</div></div>
);

function VehicleDetail({ id, go }) {
  const v = VEHICLES.find((x) => x.id === id); if (!v) return null;
  const ck = custoKm(v), sc = vehicleScore(v), b = band(sc);
  const driver = null;
  const benchC = { "Caminhão": 3.0, "Caminhonete": 7.5, "Pick-Up": 7.5, "Carro": 9, "Moto": 28 }[v.tipo] || 4;
  const refK = { "Caminhão": 5.5, "Caminhonete": 2.5, "Pick-Up": 2.5, "Carro": 1.8, "Moto": 0.6 }[v.tipo] || 4;
  const radar = [
    { k: "Combustível", v: v.media > 0 ? Math.min(100, (v.media / benchC) * 85) : 0 },
    { k: "Custo/km", v: ck > 0 ? Math.min(100, (refK / ck) * 80) : 0 },
    { k: "Manutenção", v: Math.max(0, 100 - v.manutAno * 9) },
    { k: "Multas", v: Math.max(0, 100 - v.nMultas * 12) },
    { k: "Compliance", v: v.licStatus === "PAGO" ? 95 : v.licStatus === "A VENCER" ? 60 : 35 },
  ];
  const costHist = MONTHLY.map((m) => ({ mes: m.mes, custo: Math.round(v.custoMes * (0.8 + (m.total / Math.max(1, MONTHLY[MONTHLY.length - 1].total)) * 0.4)) }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={() => go("fleet")} style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: T.textDim, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>← Voltar à frota</button>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.surface3, display: "flex", alignItems: "center", justifyContent: "center" }}><Truck size={26} color={T.accent} /></div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'IBM Plex Mono', monospace" }}>{v.placa}</div>
              <div style={{ fontSize: 13.5, color: T.textDim }}>{v.modelo} · {v.ano} · {v.tipo}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Badge cor={v.status === "ativo" ? T.emerald : v.status === "manutencao" ? T.accent : T.textFaint} soft={v.status === "ativo" ? T.emeraldSoft : v.status === "manutencao" ? T.accentSoft : T.surface3}>{v.status === "ativo" ? "Operacional" : v.status === "manutencao" ? "Manutenção recente" : "Sem registro recente"}</Badge>
                <Badge cor={T.textDim} soft={T.surface3}><MapPin size={10} style={{ marginRight: 3, verticalAlign: -1 }} />{v.unidade}</Badge>
                {driver && <Badge cor={T.sky} soft={T.skySoft}>{driver.nome}</Badge>}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ScoreRing value={sc} size={80} stroke={7} />
            <div><div style={{ fontSize: 12, color: T.textFaint }}>Score de eficiência</div><div style={{ fontSize: 15, fontWeight: 700, color: b.cor }}>{b.label}</div></div>
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
        <KPI label="Custo / km" value={ck > 0 ? `R$ ${ck}` : "—"} sub={`período (${v.km > 0 ? fmtNum(v.km) + " km" : "s/ km"})`} icon={Gauge} accent={ck > (refK) ? T.rose : T.emerald} />
        <KPI label="Custo mensal médio" value={fmtBRL(v.custoMes)} sub={`${fmtBRL(v.custoTotal)} no período`} icon={Receipt} accent={T.accent} />
        <KPI label="Manutenção (lançam.)" value={String(v.manutAno)} sub={`${fmtBRL(v.custoManut)} · ${v.nMultas} multas`} icon={Wrench} accent={v.manutAno > 15 ? T.rose : T.sky} />
        <KPI label="Consumo médio" value={v.media > 0 ? `${v.media} km/L` : "—"} sub={`${fmtNum(v.litros)} L · ${v.nAbast} abast.`} icon={Activity} accent={T.violet} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <Card>
          <SectionTitle icon={TrendingUp}>Histórico de custo operacional</SectionTitle>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={costHist} margin={{ left: -8, right: 6 }}>
              <defs><linearGradient id="vc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={b.cor} stopOpacity={0.3} /><stop offset="100%" stopColor={b.cor} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderSoft} vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: T.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TT fmt={fmtBRL} />} />
              <Area type="monotone" dataKey="custo" name="Custo" stroke={b.cor} fill="url(#vc)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle icon={Gauge}>Perfil de performance</SectionTitle>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={radar} outerRadius={78}>
              <PolarGrid stroke={T.border} />
              <PolarAngleAxis dataKey="k" tick={{ fill: T.textDim, fontSize: 10.5 }} />
              <Radar dataKey="v" stroke={b.cor} fill={b.cor} fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card style={{ borderLeft: `3px solid ${T.accent}` }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Sparkles size={18} color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 5 }}>Recomendação da IA para {v.placa}</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>
              {sc < 50
                ? `Este veículo opera com custo/km ${ck > refK ? ((ck / refK - 1) * 100).toFixed(0) + "% acima da referência da categoria" : "elevado"}, acumulando ${v.manutAno} lançamentos de manutenção (${fmtBRL(v.custoManut)}) e ${v.nMultas} multas no período. O custo de posse já compromete o retorno — recomendo cotar a renovação e reavaliar a alocação na unidade ${v.unidade}.`
                : sc < 65
                ? `Performance mediana, com sinais de atenção. O consumo de ${v.media || "—"} km/L combinado a ${v.manutAno} lançamentos de manutenção indica espaço para revisão preventiva e condução econômica, com potencial de reduzir o custo/km.`
                : `Veículo eficiente dentro dos parâmetros da categoria ${v.tipo}. Mantém bom equilíbrio entre consumo, custo/km e baixa recorrência de manutenção — bom candidato a benchmark da frota.`}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DriversView() {
  const ranked = [...DRIVERS].sort((a, b) => b.score - a.score);
  const comDados = DRIVERS.filter((d) => d.kmTotal > 0);
  const cnhVenc = DRIVERS.filter((d) => d.diasCNH != null && d.diasCNH < 0).length;
  const cnhProx = DRIVERS.filter((d) => d.diasCNH != null && d.diasCNH >= 0 && d.diasCNH <= 60).length;
  const mediaGeral = comDados.length ? (comDados.reduce((a, d) => a + d.media, 0) / comDados.length).toFixed(1) : "—";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
        <KPI label="Motoristas cadastrados" value={String(DRIVERS.length)} sub="3 unidades" icon={Users} accent={T.sky} />
        <KPI label="Com consumo registrado" value={String(comDados.length)} sub={`média ${mediaGeral} km/L`} icon={Fuel} accent={T.emerald} />
        <KPI label="CNHs vencidas" value={String(cnhVenc)} sub="regularização urgente" icon={ShieldAlert} accent={T.rose} />
        <KPI label="CNHs vencendo" value={String(cnhProx)} sub="próximos 60 dias" icon={Clock} accent={T.accent} />
      </div>
      <Card>
        <SectionTitle icon={Trophy} right={<Badge cor={T.textDim} soft={T.surface3}>eficiência + compliance</Badge>}>Ranking de motoristas</SectionTitle>
        <Table cols={["#", "Motorista", "Unidade", "CNH", "Venc. CNH", "Km período", "km/L", "Abast.", "Score"]}
          align={["left", "left", "left", "center", "center", "right", "center", "center", "center"]}
          rows={ranked.map((d, i) => {
            const b = band(d.score);
            const cnhCor = d.diasCNH == null ? T.textFaint : d.diasCNH < 0 ? T.rose : d.diasCNH <= 60 ? T.accent : T.textDim;
            return [
              <span style={{ fontWeight: 700, color: i === 0 ? T.accent : T.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>{i + 1}º</span>,
              <div><div style={{ fontWeight: 600 }}>{d.nome}</div><div style={{ fontSize: 11, color: T.textFaint }}>{d.status}</div></div>,
              <span style={{ fontSize: 12, color: T.textDim }}>{d.unidade}</span>,
              <Badge cor={T.textDim} soft={T.surface3}>{d.cat}</Badge>,
              <span style={{ fontSize: 11.5, color: cnhCor, fontFamily: "'IBM Plex Mono', monospace" }}>{d.vencCNH ? d.vencCNH.split("-").reverse().join("/") : "—"}</span>,
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{d.kmTotal > 0 ? fmtNum(d.kmTotal) : "—"}</span>,
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: d.media > 0 && d.media < 4 ? T.rose : T.text }}>{d.media > 0 ? d.media : "—"}</span>,
              <span style={{ fontSize: 12, color: T.textDim }}>{d.nAbast || "—"}</span>,
              <Badge cor={b.cor} soft={b.soft}>{d.score || "—"}</Badge>,
            ];
          })} />
      </Card>
    </div>
  );
}

function FuelView() {
  const m = fleetMetrics();
  const litros = VEHICLES.reduce((a, v) => a + v.litros, 0);
  const postos = SUPPLIERS.filter((s) => s.tipo === "Combustível");
  const precoMedio = postos.length ? (postos.reduce((a, s) => a + s.preco * s.litros, 0) / postos.reduce((a, s) => a + s.litros, 0)) : 0;
  const consumoData = VEHICLES.filter((v) => v.media > 0).map((v) => ({ placa: v.placa, kml: v.media, tipo: v.tipo })).sort((a, b) => a.kml - b.kml);
  const anomalias = consumoData.filter((d) => d.tipo === "Caminhão" && d.kml < 4.3).length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <KPI label="Gasto combustível" value={fmtBRL(m.custoComb)} delta="33%" deltaGood={false} sub="jan–abr 2026" icon={Fuel} accent={T.accent} />
        <KPI label="Litros (período)" value={fmtNum(litros)} sub="diesel + outros" icon={CircleDot} accent={T.sky} />
        <KPI label="Preço médio /L" value={`R$ ${precoMedio.toFixed(2)}`} sub="ponderado por volume" icon={TrendingUp} accent={T.rose} />
        <KPI label="Abaixo da eficiência" value={String(anomalias)} sub="caminhões < 4,3 km/L" icon={AlertTriangle} accent={T.accent} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card>
          <SectionTitle icon={Gauge}>Consumo por veículo (km/L)</SectionTitle>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={consumoData} layout="vertical" margin={{ left: 24, right: 14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderSoft} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="placa" tick={{ fill: T.textDim, fontSize: 10 }} axisLine={false} tickLine={false} width={62} />
              <Tooltip content={<TT fmt={(v) => `${v} km/L`} />} cursor={{ fill: T.surface3 }} />
              <Bar dataKey="kml" name="km/L" radius={[0, 4, 4, 0]} barSize={11}>
                {consumoData.map((d, i) => <Cell key={i} fill={d.kml < 4 ? T.rose : d.kml < 6 ? T.accent : T.emerald} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle icon={Building2}>Comparativo de postos — preço/L (alto volume)</SectionTitle>
          {postos.filter((s) => s.litros > 500).sort((a, b) => a.preco - b.preco).map((s, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${T.borderSoft}` : "none" }}>
              {i === 0 ? <Badge cor={T.emerald} soft={T.emeraldSoft}>melhor</Badge> : <span style={{ width: 7, height: 7, borderRadius: 99, background: i === arr.length - 1 ? T.rose : T.textFaint }} />}
              <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, color: T.text, fontWeight: 500 }}>{s.nome}</div><div style={{ fontSize: 11, color: T.textFaint }}>{s.abast} abast. · {fmtNum(s.litros)} L</div></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? T.emerald : i === arr.length - 1 ? T.rose : T.text, fontFamily: "'IBM Plex Mono', monospace" }}>R$ {s.preco.toFixed(2)}</div>
            </div>
          ))}
          <div style={{ marginTop: 12, background: T.emeraldSoft, borderRadius: 10, padding: 11, fontSize: 12, color: T.emerald, lineHeight: 1.5 }}><strong>Economia mapeada:</strong> concentrar volume no posto mais barato → ~{fmtBRL(2518)} no período</div>
        </Card>
      </div>
      <Card>
        <SectionTitle icon={Fuel}>Abastecimentos recentes</SectionTitle>
        <Table cols={["Data", "Placa", "Condutor", "Litros", "Valor", "Posto", "km/L", ""]}
          align={["left", "left", "left", "right", "right", "left", "right", "center"]}
          rows={FUEL_LOGS.map((f) => [
            f.data, <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{f.placa}</span>, f.cond, fmtNum(f.litros),
            <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{fmtBRL(f.valor)}</span>, <span style={{ fontSize: 12, color: T.textDim }}>{f.posto}</span>,
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: f.media > 0 && f.media < 4 ? T.rose : T.text }}>{f.media || "—"}</span>,
            f.flag === "alto" ? <AlertTriangle size={15} color={T.rose} /> : f.flag === "medio" ? <CircleDot size={13} color={T.accent} /> : <CheckCircle2 size={15} color={T.emerald} />,
          ])} />
      </Card>
    </div>
  );
}

function MaintenanceView() {
  const totalManut = VEHICLES.reduce((a, v) => a + v.custoManut, 0);
  const totalMultas = MONTHLY.reduce((a, m) => a + m.multas, 0);
  const topManut = [...VEHICLES].sort((a, b) => b.custoManut - a.custoManut).slice(0, 2);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <KPI label="Manutenção (período)" value={fmtBRL(totalManut)} sub="abr/25 – abr/26" icon={Wrench} accent={T.rose} />
        <KPI label="Multas (período)" value={fmtBRL(totalMultas)} sub="todas as unidades" icon={AlertTriangle} accent={T.accent} />
        <KPI label="Maior ofensor" value={topManut[0]?.placa || "—"} sub={`${fmtBRL(topManut[0]?.custoManut || 0)}`} icon={Activity} accent={T.rose} />
        <KPI label="Ordens registradas" value={String(VEHICLES.reduce((a, v) => a + v.manutAno, 0))} sub="lançamentos no período" icon={Calendar} accent={T.sky} />
      </div>
      <Card style={{ borderLeft: `3px solid ${T.rose}` }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Zap size={18} color={T.rose} style={{ flexShrink: 0, marginTop: 2 }} />
          <div><div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 4 }}>Análise da IA — concentração de custo</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>Dois veículos concentram o maior gasto de manutenção da frota: <strong style={{ color: T.text }}>{topManut[0]?.placa}</strong> ({fmtBRL(topManut[0]?.custoManut || 0)}, {topManut[0]?.manutAno} lançamentos) e <strong style={{ color: T.text }}>{topManut[1]?.placa}</strong> ({fmtBRL(topManut[1]?.custoManut || 0)}). A recorrência elevada sugere avaliar <strong style={{ color: T.rose }}>substituição ou revisão estrutural</strong> em vez de manter o ciclo de reparos corretivos.</div>
          </div>
        </div>
      </Card>
      <Card>
        <SectionTitle icon={Wrench} right={<Badge cor={T.textDim} soft={T.surface3}>ordens recentes</Badge>}>Histórico de manutenção</SectionTitle>
        <Table cols={["Data", "Placa", "Descrição", "Oficina", "Unidade", "Valor"]}
          align={["left", "left", "left", "left", "left", "right"]}
          rows={MAINTENANCE.map((m) => [
            m.data, <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{m.placa}</span>,
            <span style={{ fontSize: 12.5, color: T.text }}>{m.desc}</span>,
            <span style={{ fontSize: 12, color: T.textDim }}>{m.oficina}</span>,
            <Badge cor={T.textDim} soft={T.surface3}>{m.uni}</Badge>,
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, color: m.valor > 2000 ? T.rose : T.text }}>{fmtBRL(m.valor)}</span>,
          ])} />
      </Card>
      <Card>
        <SectionTitle icon={AlertTriangle} right={<Badge cor={T.accent} soft={T.accentSoft}>multas</Badge>}>Multas recentes</SectionTitle>
        <Table cols={["Data", "Placa", "Órgão", "Valor"]}
          align={["left", "left", "left", "right"]}
          rows={MULTAS.map((m) => [
            m.data, <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{m.placa}</span>,
            <span style={{ fontSize: 12, color: T.textDim }}>{m.orgao}</span>,
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{fmtBRL(m.valor)}</span>,
          ])} />
      </Card>
    </div>
  );
}

function ExpensesView() {
  const total = EXPENSE_CAT.reduce((a, c) => a + c.valor, 0);
  const maior = [...EXPENSE_CAT].sort((a, b) => b.valor - a.valor)[0] || { cat: "—", valor: 0 };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <KPI label="Despesas de frota" value={fmtBRL(total)} sub="jun–ago 2025 (planilha)" icon={Receipt} accent={T.rose} />
        <KPI label="Maior categoria" value={maior.cat} sub={`${((maior.valor / total) * 100).toFixed(0)}% do total`} icon={Fuel} accent={T.accent} />
        <KPI label="Categorias" value={String(EXPENSE_CAT.length)} sub="tipos de despesa" icon={Filter} accent={T.sky} />
        <KPI label="Custo total da frota" value={fmtBRL(MONTHLY.reduce((a, m) => a + m.total, 0))} sub="período completo" icon={TrendingUp} accent={T.violet} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 18 }}>
        <Card>
          <SectionTitle icon={Receipt}>Composição de despesas</SectionTitle>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={EXPENSE_CAT} dataKey="valor" nameKey="cat" innerRadius={58} outerRadius={92} paddingAngle={2} stroke="none">
                {EXPENSE_CAT.map((c, i) => <Cell key={i} fill={c.cor} />)}
              </Pie>
              <Tooltip content={<TT fmt={fmtBRL} />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 4 }}>
            {EXPENSE_CAT.map((c) => (
              <div key={c.cat} style={{ display: "flex", alignItems: "center", gap: 7 }}><Dot cor={c.cor} /><span style={{ fontSize: 11.5, color: T.textDim }}>{c.cat}</span></div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle icon={TrendingUp}>Evolução do custo total — últimos meses</SectionTitle>
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={MONTHLY} margin={{ left: -8, right: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderSoft} vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: T.textFaint, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TT fmt={fmtBRL} />} cursor={{ fill: T.surface3 }} />
              <Bar dataKey="manutencao" name="Manutenção" stackId="a" fill={T.rose} barSize={18} />
              <Bar dataKey="combustivel" name="Combustível" stackId="a" fill={T.accent} barSize={18} />
              <Bar dataKey="multas" name="Multas" stackId="a" fill={T.violet} radius={[3, 3, 0, 0]} barSize={18} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle icon={Filter}>Detalhamento por categoria (despesas de frota)</SectionTitle>
        <Table cols={["Categoria", "Valor", "% do total"]}
          align={["left", "right", "right"]}
          rows={EXPENSE_CAT.map((c) => [
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Dot cor={c.cor} />{c.cat}</div>,
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{fmtBRL(c.valor)}</span>,
            <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{((c.valor / total) * 100).toFixed(0)}%</span>,
          ])} />
      </Card>
    </div>
  );
}

function SuppliersView() {
  const maxGasto = Math.max(...SUPPLIERS.map((s) => s.gasto));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
        {SUPPLIERS.map((s, idx) => {
          const share = Math.round((s.gasto / maxGasto) * 100);
          return (
            <Card key={idx} hover>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{s.nome}</div>
                  <div style={{ display: "flex", gap: 7, marginTop: 6 }}><Badge cor={s.tipo === "Combustível" ? T.accent : T.violet} soft={s.tipo === "Combustível" ? T.accentSoft : T.surface3}>{s.tipo}</Badge></div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: s.tipo === "Combustível" ? T.accentSoft : T.surface3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.tipo === "Combustível" ? <Fuel size={20} color={T.accent} /> : <Wrench size={20} color={T.violet} />}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: s.preco ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8, paddingTop: 12, borderTop: `1px solid ${T.borderSoft}` }}>
                {s.preco && <Metric label="Preço/L" value={`R$ ${s.preco.toFixed(2)}`} cor={s.preco < 6.3 ? T.emerald : s.preco > 6.7 ? T.rose : T.text} />}
                <Metric label={s.tipo === "Combustível" ? "Abastec." : "Ordens"} value={String(s.abast)} />
                <Metric label="Gasto período" value={fmtBRL(s.gasto)} />
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ height: 5, background: T.surface3, borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${share}%`, height: "100%", background: s.tipo === "Combustível" ? T.accent : T.violet }} /></div>
                <div style={{ fontSize: 10.5, color: T.textFaint, marginTop: 5 }}>{share}% do maior fornecedor por volume financeiro</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function DocsView() {
  const stColor = (st) => st === "vencido" ? T.rose : st === "critico" ? T.rose : st === "alerta" ? T.accent : T.emerald;
  const stSoft = (st) => st === "vencido" ? T.roseSoft : st === "critico" ? T.roseSoft : st === "alerta" ? T.accentSoft : T.emeraldSoft;
  const stLabel = (st) => st === "vencido" ? "Vencido" : st === "critico" ? "Crítico" : st === "alerta" ? "Alerta" : "Em dia";
  const conformidade = Math.round((docCount("ok") / Math.max(1, DOCS.length)) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <KPI label="Vencidos" value={String(docCount("vencido"))} sub="regularização imediata" icon={ShieldAlert} accent={T.rose} />
        <KPI label="Críticos" value={String(docCount("critico"))} sub="≤ 15 dias" icon={AlertTriangle} accent={T.rose} />
        <KPI label="Em alerta" value={String(docCount("alerta"))} sub="16 a 45 dias" icon={Clock} accent={T.accent} />
        <KPI label="Conformidade" value={`${conformidade}%`} sub="frota + condutores" icon={BadgeCheck} accent={T.sky} />
      </div>
      <Card>
        <SectionTitle icon={FileWarning} right={<Badge cor={T.rose} soft={T.roseSoft}>{docCount("vencido")} vencidos</Badge>}>Linha do tempo de vencimentos</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 560, overflowY: "auto" }}>
          {DOCS.map((d, i) => {
            const c = stColor(d.status), soft = stSoft(d.status);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 8px", borderBottom: `1px solid ${T.borderSoft}` }}>
                <div style={{ width: 50, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{d.dias}</div><div style={{ fontSize: 10, color: T.textFaint }}>dias</div></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{d.tipo} — {d.ref}</div>
                  <div style={{ fontSize: 12, color: T.textDim }}>{d.dias < 0 ? "Venceu em" : "Vence em"} {d.venc}</div>
                </div>
                <Badge cor={c} soft={soft}>{stLabel(d.status)}</Badge>
                <button style={{ background: c + "1A", border: "none", color: c, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>Renovar</button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function TelemetryView() {
  const comDados = DRIVERS.filter((d) => d.media > 0).sort((a, b) => b.media - a.media);
  const data = comDados.map((d) => ({ nome: d.nome.split(" ").slice(0, 2).join(" "), media: d.media, km: d.kmTotal }));
  const mediaFrota = comDados.length ? (comDados.reduce((a, d) => a + d.media, 0) / comDados.length) : 0;
  const melhor = comDados[0], pior = comDados[comDados.length - 1];
  const totalKm = DRIVERS.reduce((a, d) => a + d.kmTotal, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ borderColor: T.border, background: `linear-gradient(135deg,${T.surface2},${T.surface})` }}>
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
          <Activity size={17} color={T.sky} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.6 }}>
            Esta análise é construída sobre os dados reais de abastecimento (consumo km/L e quilometragem por condutor). Dados de telemetria comportamental (frenagem, velocidade, marcha-lenta) não constam nas planilhas atuais — quando houver rastreador integrado, este módulo passa a exibi-los automaticamente.
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <KPI label="Consumo médio da frota" value={`${mediaFrota.toFixed(1)} km/L`} sub={`${comDados.length} condutores`} icon={Gauge} accent={T.sky} />
        <KPI label="Mais eficiente" value={melhor ? `${melhor.media} km/L` : "—"} sub={melhor ? melhor.nome.split(" ")[0] : "—"} icon={Trophy} accent={T.emerald} />
        <KPI label="Menor eficiência" value={pior ? `${pior.media} km/L` : "—"} sub={pior ? pior.nome.split(" ")[0] : "—"} icon={AlertTriangle} accent={T.rose} />
        <KPI label="Km registrados" value={fmtNum(totalKm)} sub="período de abastecimento" icon={Activity} accent={T.violet} />
      </div>
      <Card>
        <SectionTitle icon={Gauge} right={<Badge cor={T.textDim} soft={T.surface3}>km/L por condutor</Badge>}>Eficiência de condução</SectionTitle>
        <ResponsiveContainer width="100%" height={Math.max(260, data.length * 26)}>
          <BarChart data={data} layout="vertical" margin={{ left: 30, right: 14 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderSoft} horizontal={false} />
            <XAxis type="number" tick={{ fill: T.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: T.textDim, fontSize: 10 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip content={<TT fmt={(v) => `${v} km/L`} />} cursor={{ fill: T.surface3 }} />
            <Bar dataKey="media" name="km/L" radius={[0, 4, 4, 0]} barSize={13}>
              {data.map((d, i) => <Cell key={i} fill={d.media < 4 ? T.rose : d.media < 6 ? T.accent : T.emerald} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card style={{ borderLeft: `3px solid ${T.accent}` }}>
        <SectionTitle icon={Sparkles}>Análise de eficiência da IA</SectionTitle>
        <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.7 }}>
          A média de consumo da frota é de <strong style={{ color: T.text }}>{mediaFrota.toFixed(1)} km/L</strong>. {pior && melhor && `${pior.nome.split(" ")[0]} opera a ${pior.media} km/L, contra ${melhor.media} km/L de ${melhor.nome.split(" ")[0]} — uma diferença relevante para veículos de perfil semelhante.`} Como os caminhões representam a maior parte do consumo, ganhos de eficiência nesse grupo têm o maior impacto financeiro.
          <br /><br />
          <strong style={{ color: T.accent }}>Recomendação:</strong> orientar os condutores de menor rendimento e verificar a condição mecânica dos veículos que conduzem (filtros, calibragem, injeção). Para análise comportamental detalhada, integrar os dados do rastreador já cadastrado na operação.
        </div>
      </Card>
    </div>
  );
}

function RankingsView() {
  const vehRank = VEHICLES.map((v) => ({ ...v, sc: vehicleScore(v), ck: custoKm(v) })).sort((a, b) => b.sc - a.sc);
  const driRank = [...DRIVERS].sort((a, b) => b.score - a.score);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <Card>
        <SectionTitle icon={Crown} right={<Badge cor={T.emerald} soft={T.emeraldSoft}>por score</Badge>}>Ranking de veículos</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {vehRank.map((v, i) => {
            const b = band(v.sc);
            return (
              <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 6px", borderBottom: i < 11 ? `1px solid ${T.borderSoft}` : "none" }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: i < 3 ? T.accent + "22" : T.surface3, color: i < 3 ? T.accent : T.textFaint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{i + 1}</span>
                <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, color: T.text, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>{v.placa}</div><div style={{ fontSize: 11, color: T.textFaint }}>{v.tipo}</div></div>
                <span style={{ fontSize: 11.5, color: T.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>R$ {v.ck}/km</span>
                <Badge cor={b.cor} soft={b.soft}>{v.sc}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <SectionTitle icon={Trophy} right={<Badge cor={T.sky} soft={T.skySoft}>por comportamento</Badge>}>Ranking de motoristas</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {driRank.map((d, i) => {
            const b = band(d.score);
            return (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 6px", borderBottom: i < 11 ? `1px solid ${T.borderSoft}` : "none" }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: i < 3 ? T.emerald + "22" : T.surface3, color: i < 3 ? T.emerald : T.textFaint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{i + 1}</span>
                <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, color: T.text, fontWeight: 600 }}>{d.nome}</div><div style={{ fontSize: 11, color: T.textFaint }}>{d.unidade} · CNH {d.cat}</div></div>
                <span style={{ fontSize: 11, color: T.textFaint }}>{d.kmTotal > 0 ? fmtNum(d.kmTotal) + " km" : "—"}</span>
                <Badge cor={b.cor} soft={b.soft}>{d.score}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function VistoriaView(){const[sel,setSel]=useState(null);const st=(v)=>{const s=String(v||"").toLowerCase();if(s.includes("funciona")||s.includes("bom")||s.includes("acima")||s.includes("possui"))return"ok";if(s.includes("não funciona")||s.includes("não possui"))return"problema";return"aviso"};const stCol=(st)=>st==="ok"?T.emerald:st==="problema"?T.rose:T.accent;const stLbl=(st)=>st==="ok"?"✓ OK":st==="problema"?"✗ Problema":"! Atenção";return<div style={{gap:18,display:"flex",flexDirection:"column"}}><Card><SectionTitle icon={ClipboardList}>Histórico de vistorias ({VISTORIAS.length})</SectionTitle><div style={{gap:12,display:"flex",flexDirection:"column"}}>{VISTORIAS.map((v,i)=><div key={i} onClick={()=>setSel(i)} style={{background:sel===i?T.surface3:T.surface2,border:`1px solid ${sel===i?T.accent:T.border}`,borderRadius:12,padding:14,cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:13,color:T.text,fontWeight:600}}>{v.placa} • {v.motorista}</div><div style={{fontSize:11,color:T.textFaint,marginTop:4}}>{new Date(v.data).toLocaleDateString("pt-BR")} • {v.unidade}</div></div></div></div>)}</div></Card>{sel!==null&&<Card style={{borderLeft:`3px solid ${T.accent}`}}><div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>{[{l:"Placa",v:VISTORIAS[sel].placa},{l:"Motorista",v:VISTORIAS[sel].motorista},{l:"KM",v:VISTORIAS[sel].km},{l:"Unidade",v:VISTORIAS[sel].unidade}].map((x,i)=><div key={i} style={{background:T.surface3,borderRadius:10,padding:10}}><div style={{fontSize:11,color:T.textFaint}}>{x.l}</div><div style={{fontSize:12,color:T.text,fontWeight:600,marginTop:4}}>{x.v}</div></div>)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>{[{n:"Frontal",f:VISTORIAS[sel].fotos.frontal},{n:"Lateral Mot",f:VISTORIAS[sel].fotos.lateral_motorista},{n:"Traseira",f:VISTORIAS[sel].fotos.traseira},{n:"Lateral Car",f:VISTORIAS[sel].fotos.lateral_carona}].map((p,i)=><a key={i} href={p.f} target="_blank" rel="noopener" style={{background:T.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:`2px solid ${T.accent}`}}><Image size={18} color={T.accent} /><div style={{fontSize:10,color:T.textFaint,marginTop:4}}>{p.n}</div></a>)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8}}>{Object.entries(VISTORIAS[sel].items).map(([k,v],i)=>{const status=st(v);return<div key={i} style={{background:T.surface3,borderRadius:8,padding:8,borderLeft:`3px solid ${stCol(status)}`}}><div style={{fontSize:9.5,color:T.textFaint}}>{k.replace(/_/g," ")}</div><div style={{fontSize:11,color:stCol(status),fontWeight:600,marginTop:3}}>{stLbl(status)}</div></div>})}</div></Card>}</div>;}


function VistoriaView() {
  const [sel, setS] = useState(null);
  const st = (v) => {
    const s = String(v||"").toLowerCase();
    if(s.includes("funciona")||s.includes("bom")||s.includes("acima")||s.includes("possui")) return "ok";
    if(s.includes("não funciona")||s.includes("não possui")) return "problema";
    return "aviso";
  };
  const sc = (st) => st==="ok"?T.emerald:st==="problema"?T.rose:T.accent;
  const sl = (st) => st==="ok"?"✓ OK":st==="problema"?"✗ Problema":"! Atenção";
  return React.createElement("div",{style:{gap:18,display:"flex",flexDirection:"column"}},
    React.createElement(Card,null,
      React.createElement(SectionTitle,{icon:CheckCircle2},"Histórico de vistorias ("+VISTORIAS.length+")"),
      React.createElement("div",{style:{gap:12,display:"flex",flexDirection:"column"}},
        VISTORIAS.map((v,i)=>React.createElement("div",{key:i,onClick:()=>setS(i),style:{background:sel===i?T.surface3:T.surface2,border:"1px solid "+(sel===i?T.accent:T.border),borderRadius:12,padding:14,cursor:"pointer",transition:"all .2s"}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between"}},
            React.createElement("div",null,
              React.createElement("div",{style:{fontSize:13,color:T.text,fontWeight:600}},v.placa+" • "+v.motorista),
              React.createElement("div",{style:{fontSize:11,color:T.textFaint,marginTop:4}},new Date(v.data).toLocaleDateString("pt-BR")+" • "+v.unidade)
            )
          )
        ))
      )
    ),
    sel!==null&&React.createElement(Card,{style:{borderLeft:"3px solid "+T.accent}},
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}},
        [{l:"Placa",v:VISTORIAS[sel].placa},{l:"Motorista",v:VISTORIAS[sel].motorista},{l:"KM",v:VISTORIAS[sel].km},{l:"Unidade",v:VISTORIAS[sel].unidade}].map((x,i)=>
          React.createElement("div",{key:i,style:{background:T.surface3,borderRadius:10,padding:10}},
            React.createElement("div",{style:{fontSize:11,color:T.textFaint}},x.l),
            React.createElement("div",{style:{fontSize:12,color:T.text,fontWeight:600,marginTop:4}},x.v)
          )
        )
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}},
        [{n:"Frontal",f:VISTORIAS[sel].fotos.frontal},{n:"Lateral",f:VISTORIAS[sel].fotos.lateral_motorista},{n:"Traseira",f:VISTORIAS[sel].fotos.traseira},{n:"Carona",f:VISTORIAS[sel].fotos.lateral_carona}].map((p,i)=>
          React.createElement("a",{key:i,href:p.f,target:"_blank",rel:"noopener",style:{background:T.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+T.accent,textDecoration:"none",color:T.accent,fontSize:11}},p.n)
        )
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:6}},
        Object.entries(VISTORIAS[sel].itens).map(([k,v],i)=>{
          const status=st(v);
          return React.createElement("div",{key:i,style:{background:T.surface3,borderRadius:6,padding:8,borderLeft:"3px solid "+sc(status)}},
            React.createElement("div",{style:{fontSize:9,color:T.textFaint}},k.replace(/_/g," ")),
            React.createElement("div",{style:{fontSize:10.5,color:sc(status),fontWeight:600,marginTop:3}},sl(status))
          );
        })
      )
    )
  );
}



function VistoriaView(){
  const[sel,setS]=useState(null);
  return React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:18}},
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:12}},
      VISTORIAS.map((v,i)=>React.createElement("div",{key:i,onClick:()=>setS(i),style:{background:sel===i?x.surface3:x.surface2,border:"1px solid "+(sel===i?x.accent:x.border),borderRadius:12,padding:14,cursor:"pointer"}},
        React.createElement("div",null,
          React.createElement("div",{style:{fontSize:13,color:x.text,fontWeight:600}},v.placa+" • "+v.motorista),
          React.createElement("div",{style:{fontSize:11,color:x.textFaint,marginTop:4}},new Date(v.data).toLocaleDateString("pt-BR")+" • "+v.unidade)
        )
      ))
    ),
    sel!==null&&React.createElement("div",{style:{background:x.surface,border:"1px solid "+x.border,borderRadius:12,padding:20,marginTop:14}},
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}},
        React.createElement("div",{style:{background:x.surface3,borderRadius:10,padding:10}},React.createElement("div",{style:{fontSize:11,color:x.textFaint}},"Placa"),React.createElement("div",{style:{fontSize:12,color:x.text,fontWeight:600,marginTop:4}},VISTORIAS[sel].placa)),
        React.createElement("div",{style:{background:x.surface3,borderRadius:10,padding:10}},React.createElement("div",{style:{fontSize:11,color:x.textFaint}},"Motorista"),React.createElement("div",{style:{fontSize:12,color:x.text,fontWeight:600,marginTop:4}},VISTORIAS[sel].motorista)),
        React.createElement("div",{style:{background:x.surface3,borderRadius:10,padding:10}},React.createElement("div",{style:{fontSize:11,color:x.textFaint}},"KM"),React.createElement("div",{style:{fontSize:12,color:x.text,fontWeight:600,marginTop:4}},VISTORIAS[sel].km)),
        React.createElement("div",{style:{background:x.surface3,borderRadius:10,padding:10}},React.createElement("div",{style:{fontSize:11,color:x.textFaint}},"Unidade"),React.createElement("div",{style:{fontSize:12,color:x.text,fontWeight:600,marginTop:4}},VISTORIAS[sel].unidade))
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}},
        React.createElement("a",{href:VISTORIAS[sel].fotos.frontal,target:"_blank",rel:"noopener",style:{background:x.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+x.accent,textDecoration:"none",color:x.accent,fontSize:11}},"📸 Frontal"),
        React.createElement("a",{href:VISTORIAS[sel].fotos.lateral_motorista,target:"_blank",rel:"noopener",style:{background:x.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+x.accent,textDecoration:"none",color:x.accent,fontSize:11}},"📸 Lateral"),
        React.createElement("a",{href:VISTORIAS[sel].fotos.traseira,target:"_blank",rel:"noopener",style:{background:x.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+x.accent,textDecoration:"none",color:x.accent,fontSize:11}},"📸 Traseira"),
        React.createElement("a",{href:VISTORIAS[sel].fotos.lateral_carona,target:"_blank",rel:"noopener",style:{background:x.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+x.accent,textDecoration:"none",color:x.accent,fontSize:11}},"📸 Carona")
      )
    )
  );
}


function ReportsView() {
  const reports = [
    { nome: "Relatório executivo mensal", desc: "Resumo de KPIs, custos e insights do mês", icon: FileBarChart, cor: T.accent },
    { nome: "Custo por veículo", desc: "Detalhamento de custo/km de toda a frota", icon: Truck, cor: T.sky },
    { nome: "Performance de motoristas", desc: "Telemetria e ranking comportamental", icon: Users, cor: T.emerald },
    { nome: "Consumo de combustível", desc: "Análise por veículo, posto e período", icon: Fuel, cor: T.accent },
    { nome: "Manutenção e preditivo", desc: "Histórico, custos e alertas preditivos", icon: Wrench, cor: T.rose },
    { nome: "Compliance documental", desc: "Vencimentos de CNH, licenças e seguros", icon: ShieldAlert, cor: T.violet },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12.5, color: T.textDim, fontWeight: 600 }}>Período:</span>
          {["Hoje", "7 dias", "Mês atual", "Trimestre"].map((p, i) => (
            <button key={p} style={{ background: i === 2 ? T.accent : T.surface2, color: i === 2 ? "#0A0D13" : T.textDim, border: `1px solid ${i === 2 ? T.accent : T.borderSoft}`, padding: "7px 13px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{p}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: T.surface2, border: `1px solid ${T.border}`, color: T.text, padding: "8px 14px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}><Filter size={14} />Filtros</button>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
        {reports.map((r, i) => (
          <Card key={i} hover>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: r.cor + "1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><r.icon size={20} color={r.cor} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{r.nome}</div>
                <div style={{ fontSize: 12, color: T.textDim, marginTop: 3, lineHeight: 1.5 }}>{r.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.surface2, border: `1px solid ${T.border}`, color: T.text, padding: "8px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer" }}><Download size={13} />PDF</button>
              <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.surface2, border: `1px solid ${T.border}`, color: T.text, padding: "8px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer" }}><Download size={13} />Excel</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <Card>
        <SectionTitle icon={Building2}>Unidades operacionais</SectionTitle>
        {[["Várzea Grande", "matriz"], ["Sinop", ""], ["Nova Mutum", ""]].map((u, i) => {
          const n = VEHICLES.filter((v) => v.unidade === u[0]).length;
          return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: i < 2 ? `1px solid ${T.borderSoft}` : "none" }}>
            <MapPin size={15} color={T.accent} /><div style={{ flex: 1 }}><div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{u[0]}</div><div style={{ fontSize: 11.5, color: T.textFaint }}>{n} veículo{n !== 1 ? "s" : ""}{u[1] ? " · " + u[1] : ""}</div></div><CheckCircle2 size={15} color={T.emerald} />
          </div>
          );
        })}
      </Card>
      <Card>
        <SectionTitle icon={Sparkles}>Configuração da IA</SectionTitle>
        {[["Alertas preditivos de manutenção", true], ["Detecção de anomalia de consumo", true], ["Resumo executivo automático", true], ["Sugestões de economia em tempo real", true], ["Notificações de compliance", false]].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < 4 ? `1px solid ${T.borderSoft}` : "none" }}>
            <span style={{ fontSize: 12.5, color: T.text }}>{s[0]}</span>
            <div style={{ width: 38, height: 22, borderRadius: 99, background: s[1] ? T.accent : T.surface3, position: "relative", cursor: "pointer", transition: "background .2s" }}>
              <div style={{ width: 16, height: 16, borderRadius: 99, background: "#fff", position: "absolute", top: 3, left: s[1] ? 19 : 3, transition: "left .2s" }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ============================================================
   SHELL
============================================================ */
const NAV = [
  { k: "dashboard", l: "Dashboard Executivo", icon: LayoutDashboard, grp: "Visão geral" },
  { k: "ai", l: "Insights de IA", icon: Sparkles, grp: "Visão geral" },
  { k: "copilot", l: "Copiloto Executivo", icon: Cpu, grp: "Visão geral" },
  { k: "import", l: "Central de Importação", icon: Upload, grp: "Dados" },
  { k: "fleet", l: "Frota", icon: Truck, grp: "Operação" },
  { k: "drivers", l: "Motoristas", icon: Users, grp: "Operação" },
  { k: "fuel", l: "Combustível", icon: Fuel, grp: "Operação" },
  { k: "maint", l: "Manutenção", icon: Wrench, grp: "Operação" },
  { k: "telemetry", l: "Telemetria", icon: Activity, grp: "Operação" },
  { k: "expenses", l: "Despesas", icon: Receipt, grp: "Financeiro" },
  { k: "suppliers", l: "Fornecedores", icon: Building2, grp: "Financeiro" },
  { k: "docs", l: "Documentos", icon: FileWarning, grp: "Conformidade" },
  { k: "rankings", l: "Rankings", icon: Trophy, grp: "Análises" },
  { k: "vistoria", l: "Vistoria", icon: ClipboardList, grp: "Operações" },
  { k: "vistoria", l: "Vistoria", icon: CheckCircle2, grp: "Operações" },
  { k: "reports", l: "Relatórios", icon: FileBarChart, grp: "Análises" },
  { k: "settings", l: "Configurações", icon: Settings, grp: "Sistema" },
];
const TITLES = Object.fromEntries(NAV.map((n) => [n.k, n.l]));

export default function App() {
  const [view, setView] = useState("dashboard");
  const [vehicle, setVehicle] = useState(null);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const id = "frotiq-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap";
      document.head.appendChild(link);
    }
    const style = document.createElement("style");
    style.textContent = `@keyframes blink{0%,100%{opacity:.3}50%{opacity:1}} *::-webkit-scrollbar{width:8px;height:8px}*::-webkit-scrollbar-thumb{background:${T.surface3};border-radius:99px}*::-webkit-scrollbar-track{background:transparent}`;
    document.head.appendChild(style);
  }, []);

  const go = (v, vid = null) => { setView(v); setVehicle(vid); if (v !== "fleet") setVehicle(null); window.scrollTo(0, 0); };
  let grp = "";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: `radial-gradient(1200px 600px at 80% -10%, #0E1320, ${T.bg})`, fontFamily: "'IBM Plex Sans', system-ui, sans-serif", color: T.text }}>
      {/* SIDEBAR */}
      <aside style={{ width: 244, borderRight: `1px solid ${T.borderSoft}`, padding: "20px 14px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0, background: T.bg + "CC" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 18px", borderBottom: `1px solid ${T.borderSoft}`, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${T.accent},#C8920E)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Truck size={18} color="#0A0D13" /></div>
          <div><div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>FROTIQ</div><div style={{ fontSize: 9.5, color: T.textFaint, letterSpacing: 1, textTransform: "uppercase" }}>Fleet Intelligence</div></div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
          {NAV.map((n) => {
            const head = n.grp !== grp; grp = n.grp; const active = view === n.k;
            return (
              <React.Fragment key={n.k}>
                {head && <div style={{ fontSize: 9.5, color: T.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, padding: "12px 10px 5px" }}>{n.grp}</div>}
                <button onClick={() => go(n.k)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, border: "none", background: active ? T.accent + "1A" : "transparent", color: active ? T.accent : T.textDim, fontSize: 13, fontWeight: active ? 600 : 500, cursor: "pointer", textAlign: "left", width: "100%", transition: "background .15s" }}>
                  <n.icon size={16} /><span style={{ flex: 1 }}>{n.l}</span>
                  {n.k === "docs" && <span style={{ background: T.rose, color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "1px 6px", borderRadius: 99 }}>{DOCS.filter((d) => d.status === "vencido").length}</span>}
                  {n.k === "ai" && <span style={{ background: T.accent, color: "#0A0D13", fontSize: 9.5, fontWeight: 700, padding: "1px 6px", borderRadius: 99 }}>{INSIGHTS.length}</span>}
                </button>
              </React.Fragment>
            );
          })}
        </nav>
        <div style={{ borderTop: `1px solid ${T.borderSoft}`, paddingTop: 12, marginTop: 8, display: "flex", alignItems: "center", gap: 9, padding: "12px 8px 0" }}>
          <div style={{ width: 30, height: 30, borderRadius: 99, background: T.surface3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.accent }}>SL</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>Solução Logística</div><div style={{ fontSize: 10.5, color: T.textFaint }}>Diretor Operacional</div></div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 28px", borderBottom: `1px solid ${T.borderSoft}`, position: "sticky", top: 0, background: T.bg + "DD", backdropFilter: "blur(8px)", zIndex: 10 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{vehicle ? "Detalhe do Veículo" : TITLES[view]}</h1>
            <div style={{ fontSize: 11.5, color: T.textFaint, marginTop: 1 }}>Solução Locadora de Toaletes Ltda. · Maio 2026 · 3 unidades</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.surface, border: `1px solid ${T.borderSoft}`, borderRadius: 10, padding: "8px 12px", width: 240 }}>
            <Search size={15} color={T.textFaint} /><input placeholder="Buscar placa, motorista..." style={{ background: "transparent", border: "none", outline: "none", color: T.text, fontSize: 12.5, flex: 1 }} />
          </div>
          <button style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: T.surface, border: `1px solid ${T.borderSoft}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={16} color={T.textDim} /><span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 99, background: T.rose }} />
          </button>
        </header>

        <div style={{ padding: 28, flex: 1 }}>
          {view === "dashboard" && <Dashboard go={go} />}
          {view === "ai" && <AIInsights />}
          {view === "copilot" && <CopilotPage />}
          {view === "import" && <ImportCenter />}
          {view === "fleet" && <Fleet selected={vehicle} go={go} />}
          {view === "drivers" && <DriversView />}
          {view === "fuel" && <FuelView />}
          {view === "maint" && <MaintenanceView />}
          {view === "telemetry" && <TelemetryView />}
          {view === "expenses" && <ExpensesView />}
          {view === "suppliers" && <SuppliersView />}
          {view === "docs" && <DocsView />}
          {view === "rankings" && <RankingsView />}
          {view === "vistoria" && <VistoriaView />}
          {view === "vistoria" && <VistoriaView />}
          {view === "reports" && <ReportsView />}
          {view === "settings" && <SettingsView />}
        </div>
      </main>

      {/* FAB COPILOTO */}
      {view !== "copilot" && (
        <>
          <button onClick={() => setCopilotOpen((o) => !o)} style={{ position: "fixed", bottom: 24, right: 24, width: 54, height: 54, borderRadius: 99, background: `linear-gradient(135deg,${T.accent},#C8920E)`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 8px 30px rgba(245,184,30,.35)", zIndex: 30 }}>
            {copilotOpen ? <X size={22} color="#0A0D13" /> : <Sparkles size={22} color="#0A0D13" />}
          </button>
          {copilotOpen && (
            <div style={{ position: "fixed", bottom: 90, right: 24, width: 370, height: 520, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 18, display: "flex", flexDirection: "column", zIndex: 30, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: T.accent + "22", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={16} color={T.accent} /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>Copiloto Executivo</div><div style={{ fontSize: 10.5, color: T.emerald }}>● online</div></div>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}><CopilotChat compact /></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
