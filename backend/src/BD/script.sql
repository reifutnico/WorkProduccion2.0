USE [master]
GO
/****** Object:  Database [WorkyDB]    Script Date: 13/9/2024 11:56:34 ******/
CREATE DATABASE [WorkyDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'WorkyDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\WorkyDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'WorkyDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\WorkyDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [WorkyDB] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [WorkyDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [WorkyDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [WorkyDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [WorkyDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [WorkyDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [WorkyDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [WorkyDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [WorkyDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [WorkyDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [WorkyDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [WorkyDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [WorkyDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [WorkyDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [WorkyDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [WorkyDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [WorkyDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [WorkyDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [WorkyDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [WorkyDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [WorkyDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [WorkyDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [WorkyDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [WorkyDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [WorkyDB] SET RECOVERY FULL 
GO
ALTER DATABASE [WorkyDB] SET  MULTI_USER 
GO
ALTER DATABASE [WorkyDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [WorkyDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [WorkyDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [WorkyDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [WorkyDB] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'WorkyDB', N'ON'
GO
ALTER DATABASE [WorkyDB] SET QUERY_STORE = OFF
GO
USE [WorkyDB]
GO
/****** Object:  User [alumno]    Script Date: 13/9/2024 11:56:34 ******/
CREATE USER [alumno] FOR LOGIN [alumno] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[CategoriaMadre]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoriaMadre](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
 CONSTRAINT [PK_CategoriaMadre] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categorias]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categorias](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[Popularidad] [int] NULL,
	[id_CategoriaMadre] [int] NOT NULL,
 CONSTRAINT [PK_Categorias] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Disponibilidad]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Disponibilidad](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Dia] [varchar](10) NOT NULL,
	[HoraDesde] [time](7) NOT NULL,
	[HoraHasta] [time](7) NOT NULL,
	[DuracionTurno] [time](7) NOT NULL,
	[Descanso] [time](7) NOT NULL,
	[idServicio] [int] NOT NULL,
 CONSTRAINT [PK_Disponibilidad] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Etiquetas]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Etiquetas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](50) NULL,
 CONSTRAINT [PK_Etiquetas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EtiquetasPorServicio]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EtiquetasPorServicio](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idServicio] [int] NOT NULL,
	[idEtiqueta] [int] NOT NULL,
 CONSTRAINT [PK_EtiquetasPorServicio] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Servicios]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Servicios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idCreador] [int] NOT NULL,
	[idCategoria] [int] NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[Descripcion] [varchar](max) NOT NULL,
	[Precio] [money] NOT NULL,
	[Foto] [varchar](max) NULL,
 CONSTRAINT [PK_Servicios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ServiciosContratados]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ServiciosContratados](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idUsuario] [int] NOT NULL,
	[idServicio] [int] NOT NULL,
	[HorarioReunion] [date] NOT NULL,
	[Estado] [smallint] NOT NULL,
	[DescripcionProblema] [varchar](max) NOT NULL,
	[FotoProblema] [varchar](max) NULL,
 CONSTRAINT [PK_ServiciosContratados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Turnos]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Turnos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[comienzo] [time](7) NOT NULL,
	[final] [time](7) NOT NULL,
	[idDisponibilidad] [int] NOT NULL,
	[estado] [bit] NOT NULL,
 CONSTRAINT [PK_Turnos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 13/9/2024 11:56:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[verificadoPrestador] [bit] NOT NULL,
	[verificadoContratador] [bit] NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[password] [nchar](10) NOT NULL,
	[mail] [varchar](50) NOT NULL,
	[telefono] [varchar](22) NOT NULL,
	[fechaNacimiento] [date] NOT NULL,
	[fotoPerfil] [varchar](max) NULL,
 CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[CategoriaMadre] ON 

INSERT [dbo].[CategoriaMadre] ([id], [nombre]) VALUES (1, N'Hogar')
INSERT [dbo].[CategoriaMadre] ([id], [nombre]) VALUES (2, N'Educacion')
INSERT [dbo].[CategoriaMadre] ([id], [nombre]) VALUES (3, N'Diseño')
SET IDENTITY_INSERT [dbo].[CategoriaMadre] OFF
GO
SET IDENTITY_INSERT [dbo].[Categorias] ON 

INSERT [dbo].[Categorias] ([id], [Nombre], [Popularidad], [id_CategoriaMadre]) VALUES (1, N'Plomeria', 10, 1)
INSERT [dbo].[Categorias] ([id], [Nombre], [Popularidad], [id_CategoriaMadre]) VALUES (2, N'Ingles', 20, 2)
INSERT [dbo].[Categorias] ([id], [Nombre], [Popularidad], [id_CategoriaMadre]) VALUES (3, N'Diseño grafico', 30, 3)
SET IDENTITY_INSERT [dbo].[Categorias] OFF
GO
SET IDENTITY_INSERT [dbo].[Disponibilidad] ON 

INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (2, N'Wednesday', CAST(N'12:00:00' AS Time), CAST(N'20:00:00' AS Time), CAST(N'02:00:00' AS Time), CAST(N'00:30:00' AS Time), 14)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (3, N'Martes', CAST(N'13:30:00' AS Time), CAST(N'17:45:00' AS Time), CAST(N'02:05:00' AS Time), CAST(N'00:30:00' AS Time), 15)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (4, N'Lunes', CAST(N'23:54:00' AS Time), CAST(N'03:26:00' AS Time), CAST(N'23:46:00' AS Time), CAST(N'12:35:00' AS Time), 16)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (6, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 17)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (7, N'Lunes', CAST(N'11:00:00' AS Time), CAST(N'22:00:00' AS Time), CAST(N'02:00:00' AS Time), CAST(N'00:30:00' AS Time), 18)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (8, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 19)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (9, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 20)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (10, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 21)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (11, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 22)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (12, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 23)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (13, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 24)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (14, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 25)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (15, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 26)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (16, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 27)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (17, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 28)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (22, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 33)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (23, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 34)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (24, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 35)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (25, N'Lunes', CAST(N'11:00:00' AS Time), CAST(N'22:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 35)
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (26, N'Lunes', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 36)
SET IDENTITY_INSERT [dbo].[Disponibilidad] OFF
GO
SET IDENTITY_INSERT [dbo].[Etiquetas] ON 

INSERT [dbo].[Etiquetas] ([id], [Nombre]) VALUES (1, N'Etiqueta1')
INSERT [dbo].[Etiquetas] ([id], [Nombre]) VALUES (2, N'Etiqueta2')
INSERT [dbo].[Etiquetas] ([id], [Nombre]) VALUES (3, N'Etiqueta3')
SET IDENTITY_INSERT [dbo].[Etiquetas] OFF
GO
SET IDENTITY_INSERT [dbo].[EtiquetasPorServicio] ON 

INSERT [dbo].[EtiquetasPorServicio] ([id], [idServicio], [idEtiqueta]) VALUES (1, 1, 1)
INSERT [dbo].[EtiquetasPorServicio] ([id], [idServicio], [idEtiqueta]) VALUES (2, 2, 2)
INSERT [dbo].[EtiquetasPorServicio] ([id], [idServicio], [idEtiqueta]) VALUES (3, 3, 3)
SET IDENTITY_INSERT [dbo].[EtiquetasPorServicio] OFF
GO
SET IDENTITY_INSERT [dbo].[Servicios] ON 

INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (1, 1, 1, N'Servicio1', N'Descripcion1', 100.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (2, 2, 2, N'Servicio actualizado', N'Descripción del nuevo servicio', 150.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (3, 3, 3, N'Servicio3', N'Descripcion3', 300.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (4, 1, 1, N'Nuevo Servicio', N'Descripción del nuevo servicio', 150.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (5, 1, 1, N'a', N'a', 200.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (6, 1, 1, N'Nuevo Servicio', N'Descripción del nuevo servicio', 150.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (7, 1, 1, N'Nuevo Servicio', N'Descripción del nuevo servicio', 150.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (8, 1, 1, N'Nuevo Servicio', N'Descripción del nuevo servicio', 150.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (9, 1, 1, N'Nuevo Servicio', N'Descripción del nuevo servicio', 150.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (10, 1, 1, N'Nuevo Servicio', N'Descripción del nuevo servicio', 150.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (11, 1, 1, N'Nuevo Servicio', N'Descripción del nuevo servicio', 150.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (12, 1, 1, N'Servicio Ejemplo', N'Descripcion del servicio ejemplo', 100.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (14, 1, 1, N'URIAS', N'WHAT THE HEEEELL OOOOMAAAGAAAD WOooOOooOOOO', 10.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (15, 1, 1, N'Servicio expertos bob', N'POLIMARDO PEZZUTI BUENARDOPOLIS', 120.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (16, 1, 1, N'Sigma', N'Presidente', 900.0000, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhkp0j27SHSdJ-xqXXxVb1O8pxGRZV2bfYg&s')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (17, 1, 1, N'REIFUT', N'aaa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (18, 1, 1, N'REIFUT', N'aa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (19, 1, 1, N'REIFUT', N'aaa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (20, 1, 1, N'REIFUT3', N'aaa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (21, 1, 1, N'aaa', N'aaa', 222.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (22, 1, 1, N'prueba', N'aa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (23, 1, 1, N'prueba', N'aa', 222.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (24, 1, 1, N'REIFUT', N'a', 222.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (25, 1, 1, N'REIFUT', N'aa', 1.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (26, 1, 1, N'REIFUT', N'aa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (27, 1, 1, N'REIFUT', N'q', 2.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (28, 1, 1, N'REIFUT', N'aa', 1.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (29, 1, 1, N'REIFUT', N'aa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (30, 1, 1, N'REIFUT', N'aa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (31, 1, 1, N'REIFUT', N'aa', 222.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (32, 1, 1, N'REIFUT', N'aa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (33, 1, 1, N'REIFUT', N'aa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (34, 1, 1, N'REIFUT', N'aa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (35, 1, 1, N'REIFUT', N'aaa', 22.0000, N'gallardo.jpg')
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (36, 1, 1, N'axel', N'aa', 1.0000, N'gallardo.jpg')
SET IDENTITY_INSERT [dbo].[Servicios] OFF
GO
SET IDENTITY_INSERT [dbo].[ServiciosContratados] ON 

INSERT [dbo].[ServiciosContratados] ([id], [idUsuario], [idServicio], [HorarioReunion], [Estado], [DescripcionProblema], [FotoProblema]) VALUES (1, 1, 1, CAST(N'2024-06-24' AS Date), 1, N'Descripcion del problema 1', NULL)
INSERT [dbo].[ServiciosContratados] ([id], [idUsuario], [idServicio], [HorarioReunion], [Estado], [DescripcionProblema], [FotoProblema]) VALUES (2, 2, 2, CAST(N'2024-06-25' AS Date), 0, N'Descripcion del problema 2', NULL)
INSERT [dbo].[ServiciosContratados] ([id], [idUsuario], [idServicio], [HorarioReunion], [Estado], [DescripcionProblema], [FotoProblema]) VALUES (3, 3, 3, CAST(N'2024-06-26' AS Date), 1, N'Descripcion del problema 3', NULL)
SET IDENTITY_INSERT [dbo].[ServiciosContratados] OFF
GO
SET IDENTITY_INSERT [dbo].[Turnos] ON 

INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (3, CAST(N'11:00:00' AS Time), CAST(N'12:00:00' AS Time), 25, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (4, CAST(N'12:30:00' AS Time), CAST(N'13:30:00' AS Time), 25, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (5, CAST(N'14:00:00' AS Time), CAST(N'15:00:00' AS Time), 25, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (6, CAST(N'15:30:00' AS Time), CAST(N'16:30:00' AS Time), 25, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (7, CAST(N'17:00:00' AS Time), CAST(N'18:00:00' AS Time), 25, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (8, CAST(N'18:30:00' AS Time), CAST(N'19:30:00' AS Time), 25, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (9, CAST(N'20:00:00' AS Time), CAST(N'21:00:00' AS Time), 25, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (10, CAST(N'10:00:00' AS Time), CAST(N'11:00:00' AS Time), 26, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (11, CAST(N'11:30:00' AS Time), CAST(N'12:30:00' AS Time), 26, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (12, CAST(N'13:00:00' AS Time), CAST(N'14:00:00' AS Time), 26, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (13, CAST(N'14:30:00' AS Time), CAST(N'15:30:00' AS Time), 26, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (14, CAST(N'16:00:00' AS Time), CAST(N'17:00:00' AS Time), 26, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (15, CAST(N'17:30:00' AS Time), CAST(N'18:30:00' AS Time), 26, 0)
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad], [estado]) VALUES (16, CAST(N'19:00:00' AS Time), CAST(N'20:00:00' AS Time), 26, 0)
SET IDENTITY_INSERT [dbo].[Turnos] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuarios] ON 

INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil]) VALUES (1, 1, 1, N'Usuario1', N'password1 ', N'usuario1@mail.com', N'1234567890', CAST(N'1980-01-01' AS Date), NULL)
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil]) VALUES (2, 0, 1, N'Usuario2', N'password2 ', N'usuario2@mail.com', N'0987654321', CAST(N'1990-02-02' AS Date), NULL)
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil]) VALUES (3, 1, 0, N'Usuario3', N'password3 ', N'usuario3@mail.com', N'1122334455', CAST(N'2000-03-03' AS Date), NULL)
SET IDENTITY_INSERT [dbo].[Usuarios] OFF
GO
ALTER TABLE [dbo].[Categorias]  WITH CHECK ADD  CONSTRAINT [FK_Categorias_CategoriaMadre] FOREIGN KEY([id_CategoriaMadre])
REFERENCES [dbo].[CategoriaMadre] ([id])
GO
ALTER TABLE [dbo].[Categorias] CHECK CONSTRAINT [FK_Categorias_CategoriaMadre]
GO
ALTER TABLE [dbo].[Disponibilidad]  WITH CHECK ADD  CONSTRAINT [FK_Disponibilidad_Servicios] FOREIGN KEY([idServicio])
REFERENCES [dbo].[Servicios] ([id])
GO
ALTER TABLE [dbo].[Disponibilidad] CHECK CONSTRAINT [FK_Disponibilidad_Servicios]
GO
ALTER TABLE [dbo].[EtiquetasPorServicio]  WITH CHECK ADD  CONSTRAINT [FK_EtiquetasPorServicio_Etiquetas] FOREIGN KEY([idEtiqueta])
REFERENCES [dbo].[Etiquetas] ([id])
GO
ALTER TABLE [dbo].[EtiquetasPorServicio] CHECK CONSTRAINT [FK_EtiquetasPorServicio_Etiquetas]
GO
ALTER TABLE [dbo].[EtiquetasPorServicio]  WITH CHECK ADD  CONSTRAINT [FK_EtiquetasPorServicio_Servicios] FOREIGN KEY([idServicio])
REFERENCES [dbo].[Servicios] ([id])
GO
ALTER TABLE [dbo].[EtiquetasPorServicio] CHECK CONSTRAINT [FK_EtiquetasPorServicio_Servicios]
GO
ALTER TABLE [dbo].[Servicios]  WITH CHECK ADD  CONSTRAINT [FK_Servicios_Categorias] FOREIGN KEY([idCategoria])
REFERENCES [dbo].[Categorias] ([id])
GO
ALTER TABLE [dbo].[Servicios] CHECK CONSTRAINT [FK_Servicios_Categorias]
GO
ALTER TABLE [dbo].[Servicios]  WITH CHECK ADD  CONSTRAINT [FK_Servicios_Usuarios] FOREIGN KEY([idCreador])
REFERENCES [dbo].[Usuarios] ([id])
GO
ALTER TABLE [dbo].[Servicios] CHECK CONSTRAINT [FK_Servicios_Usuarios]
GO
ALTER TABLE [dbo].[ServiciosContratados]  WITH CHECK ADD  CONSTRAINT [FK_ServiciosContratados_Servicios] FOREIGN KEY([idServicio])
REFERENCES [dbo].[Servicios] ([id])
GO
ALTER TABLE [dbo].[ServiciosContratados] CHECK CONSTRAINT [FK_ServiciosContratados_Servicios]
GO
ALTER TABLE [dbo].[ServiciosContratados]  WITH CHECK ADD  CONSTRAINT [FK_ServiciosContratados_Usuarios] FOREIGN KEY([idUsuario])
REFERENCES [dbo].[Usuarios] ([id])
GO
ALTER TABLE [dbo].[ServiciosContratados] CHECK CONSTRAINT [FK_ServiciosContratados_Usuarios]
GO
USE [master]
GO
ALTER DATABASE [WorkyDB] SET  READ_WRITE 
GO