USE [master]
GO
/****** Object:  Database [WorkyDB]    Script Date: 28/10/2024 12:15:51 ******/
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
/****** Object:  User [alumno]    Script Date: 28/10/2024 12:15:52 ******/
CREATE USER [alumno] FOR LOGIN [alumno] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[CategoriaMadre]    Script Date: 28/10/2024 12:15:52 ******/
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
/****** Object:  Table [dbo].[Categorias]    Script Date: 28/10/2024 12:15:52 ******/
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
/****** Object:  Table [dbo].[Disponibilidad]    Script Date: 28/10/2024 12:15:52 ******/
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
/****** Object:  Table [dbo].[Etiquetas]    Script Date: 28/10/2024 12:15:52 ******/
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
/****** Object:  Table [dbo].[EtiquetasPorServicio]    Script Date: 28/10/2024 12:15:52 ******/
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
/****** Object:  Table [dbo].[pending_users]    Script Date: 28/10/2024 12:15:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pending_users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[verificadoPrestador] [bit] NOT NULL,
	[verificadoContratador] [bit] NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[mail] [varchar](50) NOT NULL,
	[telefono] [varchar](22) NOT NULL,
	[fechaNacimiento] [date] NOT NULL,
	[miembro] [bit] NOT NULL,
	[fotoPerfil] [varchar](max) NULL,
 CONSTRAINT [PK_pending_users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Servicios]    Script Date: 28/10/2024 12:15:52 ******/
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
/****** Object:  Table [dbo].[Turnos]    Script Date: 28/10/2024 12:15:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Turnos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[comienzo] [time](7) NOT NULL,
	[final] [time](7) NOT NULL,
	[idDisponibilidad] [int] NOT NULL,
 CONSTRAINT [PK_Turnos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[turnosReservados]    Script Date: 28/10/2024 12:15:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[turnosReservados](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[fecha] [date] NOT NULL,
	[idTurno] [int] NOT NULL,
	[estado] [tinyint] NULL,
	[idUsuario] [int] NULL,
 CONSTRAINT [PK_turnosReservados] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 28/10/2024 12:15:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[verificadoPrestador] [bit] NOT NULL,
	[verificadoContratador] [bit] NOT NULL,
	[Nombre] [varchar](50) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[mail] [varchar](50) NOT NULL,
	[telefono] [varchar](22) NOT NULL,
	[fechaNacimiento] [date] NOT NULL,
	[fotoPerfil] [varchar](max) NULL,
	[miembro] [bit] NOT NULL,
 CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[CategoriaMadre] ON 
GO
INSERT [dbo].[CategoriaMadre] ([id], [nombre]) VALUES (1, N'Plomeria')
GO
INSERT [dbo].[CategoriaMadre] ([id], [nombre]) VALUES (2, N'Artista')
GO
INSERT [dbo].[CategoriaMadre] ([id], [nombre]) VALUES (3, N'Gasistas')
GO
INSERT [dbo].[CategoriaMadre] ([id], [nombre]) VALUES (4, N'Entrenador')
GO
INSERT [dbo].[CategoriaMadre] ([id], [nombre]) VALUES (5, N'Programador')
GO
SET IDENTITY_INSERT [dbo].[CategoriaMadre] OFF
GO
SET IDENTITY_INSERT [dbo].[Categorias] ON 
GO
INSERT [dbo].[Categorias] ([id], [Nombre], [Popularidad], [id_CategoriaMadre]) VALUES (1, N'Inodoros', 10, 1)
GO
INSERT [dbo].[Categorias] ([id], [Nombre], [Popularidad], [id_CategoriaMadre]) VALUES (2, N'Cuadros', 5, 2)
GO
INSERT [dbo].[Categorias] ([id], [Nombre], [Popularidad], [id_CategoriaMadre]) VALUES (3, N'Estufas', 7, 3)
GO
SET IDENTITY_INSERT [dbo].[Categorias] OFF
GO
SET IDENTITY_INSERT [dbo].[Disponibilidad] ON 
GO
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (1, N'Monday', CAST(N'09:30:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 7)
GO
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (2, N'Tuesday', CAST(N'10:00:00' AS Time), CAST(N'22:00:00' AS Time), CAST(N'01:30:00' AS Time), CAST(N'01:00:00' AS Time), 7)
GO
INSERT [dbo].[Disponibilidad] ([id], [Dia], [HoraDesde], [HoraHasta], [DuracionTurno], [Descanso], [idServicio]) VALUES (3, N'Monday', CAST(N'10:00:00' AS Time), CAST(N'21:00:00' AS Time), CAST(N'01:00:00' AS Time), CAST(N'00:30:00' AS Time), 8)
GO
SET IDENTITY_INSERT [dbo].[Disponibilidad] OFF
GO
SET IDENTITY_INSERT [dbo].[pending_users] ON 
GO
INSERT [dbo].[pending_users] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [miembro], [fotoPerfil]) VALUES (10, 0, 0, N'nico', N'$2a$10$Eb334WkbmzXVBoJpSavf/es7KHXw0Z3vQ9Ayky2h1JYF1YCb75Z.q', N'nicoreifut@gmail.com', N'111111111111', CAST(N'2000-01-01' AS Date), 0, N'')
GO
SET IDENTITY_INSERT [dbo].[pending_users] OFF
GO
SET IDENTITY_INSERT [dbo].[Servicios] ON 
GO
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (6, 1, 1, N'REIFUT', N'aaa', 22.0000, N'aaaa.jfif')
GO
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (7, 1, 1, N'URI', N'aaa', 100.0000, N'aa.jfif')
GO
INSERT [dbo].[Servicios] ([id], [idCreador], [idCategoria], [Nombre], [Descripcion], [Precio], [Foto]) VALUES (8, 1, 1, N'IVO', N'aaaaaa', 11.0000, N'aa.jfif')
GO
SET IDENTITY_INSERT [dbo].[Servicios] OFF
GO
SET IDENTITY_INSERT [dbo].[Turnos] ON 
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (1, CAST(N'09:30:00' AS Time), CAST(N'10:30:00' AS Time), 1)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (2, CAST(N'11:00:00' AS Time), CAST(N'12:00:00' AS Time), 1)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (3, CAST(N'12:30:00' AS Time), CAST(N'13:30:00' AS Time), 1)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (4, CAST(N'14:00:00' AS Time), CAST(N'15:00:00' AS Time), 1)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (5, CAST(N'15:30:00' AS Time), CAST(N'16:30:00' AS Time), 1)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (6, CAST(N'17:00:00' AS Time), CAST(N'18:00:00' AS Time), 1)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (7, CAST(N'18:30:00' AS Time), CAST(N'19:30:00' AS Time), 1)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (8, CAST(N'20:00:00' AS Time), CAST(N'21:00:00' AS Time), 1)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (9, CAST(N'10:00:00' AS Time), CAST(N'11:30:00' AS Time), 2)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (10, CAST(N'12:30:00' AS Time), CAST(N'14:00:00' AS Time), 2)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (11, CAST(N'15:00:00' AS Time), CAST(N'16:30:00' AS Time), 2)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (12, CAST(N'17:30:00' AS Time), CAST(N'19:00:00' AS Time), 2)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (13, CAST(N'20:00:00' AS Time), CAST(N'21:30:00' AS Time), 2)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (14, CAST(N'10:00:00' AS Time), CAST(N'11:00:00' AS Time), 3)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (15, CAST(N'11:30:00' AS Time), CAST(N'12:30:00' AS Time), 3)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (16, CAST(N'13:00:00' AS Time), CAST(N'14:00:00' AS Time), 3)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (17, CAST(N'14:30:00' AS Time), CAST(N'15:30:00' AS Time), 3)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (18, CAST(N'16:00:00' AS Time), CAST(N'17:00:00' AS Time), 3)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (19, CAST(N'17:30:00' AS Time), CAST(N'18:30:00' AS Time), 3)
GO
INSERT [dbo].[Turnos] ([id], [comienzo], [final], [idDisponibilidad]) VALUES (20, CAST(N'19:00:00' AS Time), CAST(N'20:00:00' AS Time), 3)
GO
SET IDENTITY_INSERT [dbo].[Turnos] OFF
GO
SET IDENTITY_INSERT [dbo].[turnosReservados] ON 
GO
INSERT [dbo].[turnosReservados] ([id], [fecha], [idTurno], [estado], [idUsuario]) VALUES (10, CAST(N'2024-10-29' AS Date), 9, 0, 1)
GO
INSERT [dbo].[turnosReservados] ([id], [fecha], [idTurno], [estado], [idUsuario]) VALUES (11, CAST(N'2024-10-29' AS Date), 10, 0, 1)
GO
INSERT [dbo].[turnosReservados] ([id], [fecha], [idTurno], [estado], [idUsuario]) VALUES (12, CAST(N'2024-10-29' AS Date), 11, 0, 1)
GO
SET IDENTITY_INSERT [dbo].[turnosReservados] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuarios] ON 
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (1, 1, 0, N'Lionel Messi', N'ContraseñaSegura123!', N'lionel.messi@email.com', N'1161234567', CAST(N'1987-06-24' AS Date), NULL, 1)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (2, 0, 1, N'Gabriela Sabatini', N'ContraseñaSegura123!', N'gabriela.sabatini@email.com', N'1162345678', CAST(N'1970-05-16' AS Date), NULL, 1)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (3, 1, 1, N'Ricardo Darín', N'ContraseñaSegura123!', N'ricardo.darin@email.com', N'1163456789', CAST(N'1957-01-16' AS Date), NULL, 0)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (4, 0, 0, N'Marta Minujín', N'ContraseñaSegura123!', N'marta.minujin@email.com', N'1164567890', CAST(N'1943-01-30' AS Date), NULL, 1)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (5, 1, 0, N'Diego Maradona', N'ContraseñaSegura123!', N'diego.maradona@email.com', N'1165678901', CAST(N'1960-10-30' AS Date), NULL, 1)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (6, 0, 1, N'Cecilia Roth', N'ContraseñaSegura123!', N'cecilia.roth@email.com', N'1166789012', CAST(N'1956-08-08' AS Date), NULL, 0)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (7, 1, 1, N'Gustavo Cerati', N'ContraseñaSegura123!', N'gustavo.cerati@email.com', N'1167890123', CAST(N'1959-08-11' AS Date), NULL, 1)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (8, 0, 0, N'Mercedes Sosa', N'ContraseñaSegura123!', N'mercedes.sosa@email.com', N'1168901234', CAST(N'1935-07-09' AS Date), NULL, 0)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (9, 1, 0, N'Jorge Luis Borges', N'ContraseñaSegura123!', N'jorge.borges@email.com', N'1169012345', CAST(N'1899-08-24' AS Date), NULL, 1)
GO
INSERT [dbo].[Usuarios] ([id], [verificadoPrestador], [verificadoContratador], [Nombre], [password], [mail], [telefono], [fechaNacimiento], [fotoPerfil], [miembro]) VALUES (10, 0, 1, N'Eva Perón', N'ContraseñaSegura123!', N'eva.peron@email.com', N'1160123456', CAST(N'1919-05-07' AS Date), NULL, 1)
GO
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
USE [master]
GO
ALTER DATABASE [WorkyDB] SET  READ_WRITE 
GO
