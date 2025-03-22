"use client";
import React, { ReactNode, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

// Ícones do Material‑UI
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import BarChartIcon from "@mui/icons-material/BarChart";
import BuildIcon from "@mui/icons-material/Build";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SettingsIcon from "@mui/icons-material/Settings";
import GridViewIcon from "@mui/icons-material/GridView";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import LockIcon from "@mui/icons-material/Lock";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Image from "next/image";
import { AccountBalanceOutlined, AccountCircleOutlined, AdminPanelSettingsOutlined, BadgeOutlined, CastForEducation, DocumentScannerOutlined, GasMeterOutlined, GpsFixed, GroupAddOutlined, Groups2, HailOutlined, HelpOutline, HomeOutlined, LanOutlined, LocalConvenienceStoreOutlined, LocalGasStationOutlined, ManageAccounts, ManageHistoryOutlined, MenuOpen, NoCrashOutlined, PendingActions, PostAddOutlined, QueryBuilderSharp, QueryStatsOutlined, ReceiptLongOutlined, RequestPageOutlined, RoomOutlined, School, SettingsOutlined, TransferWithinAStationOutlined } from "@mui/icons-material";
import AuthTokenService from "@/app/authentication/auth.token";
import Cabecalho from "./Cabecalho";
import Footer from "./Footer";

interface LayoutProps {
    children: ReactNode;
}

export default function LayoutExterno({ children }: LayoutProps) {
    const router = useRouter();

    return (
        <>
            {/* HEADER */}
            <Cabecalho />
            {/* CONTEÚDO PRINCIPAL */}
            <div>{children}</div>
            <Footer />
        </>
    );
}
