"use client";
import { useState, useRef, useEffect } from "react";
import { FaStar, FaArrowsAltH } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Review } from "@/types/Review";

export default function TestimoniosSection() {
	const { data: session } = useSession();
	const dni = session?.user?.dni;

	const [usuario, setUsuario] = useState<{ nombre: string; apellido: string }>({
		nombre: "",
		apellido: "",
	});

	const [reviews, setReviews] = useState<Review[]>([]);

	// Estados para nueva review
	const [showModal, setShowModal] = useState(false);
	const [stars, setStars] = useState(0);
	const [comentario, setComentario] = useState("");
	const [foto, setFoto] = useState<File | null>(null);
	const [fotoPreview, setFotoPreview] = useState<string | null>(null);
	const [enviando, setEnviando] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const inputFileRef = useRef<HTMLInputElement>(null);

	function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setFoto(file);
			setFotoPreview(URL.createObjectURL(file));
		}
	}

	async function fetchUsuario(dni: string) {
		try {
			const res = await fetch(`/api/usuarios/${dni}`);
			if (!res.ok) {
				throw new Error("Error fetching usuario");
			}
			const data = await res.json();
			setUsuario({ nombre: data.nombre, apellido: data.apellido });
		} catch (error) {
			console.error("Error fetching usuario:", error);
		}
	}

	async function fetchReviews() {
		try {
			const res = await fetch("/api/review");
			const data = await res.json();
			const mapped: Review[] = data.map((r: any) => ({
				id: r.id,
				user: { nombre: r.nombre, apellido: r.apellido },
				stars: r.estrellas,
				comentario: r.comentario,
				foto: r.foto_url,
			}));
			setReviews(mapped);
		} catch (error) {
			console.error("Error fetching reviews:", error);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!foto) return;
		setEnviando(true);
		setErrorMsg(null);

		let fotoUrl = "";
		try {
			const form = new FormData();
			form.append("file", foto);
			form.append(
				"upload_preset",
				process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
			);
			const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
			const res = await axios.post(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				form
			);
			fotoUrl = res.data.secure_url;
		} catch (error) {
			console.error("Error subiendo a Cloudinary", error);
			setErrorMsg("Error al subir la imagen. Intenta nuevamente.");
			setEnviando(false);
			return;
		}

		console.log("Enviando review para DNI:", dni);

		try {
			const res = await fetch("/api/review", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					usuario_dni: dni,
					nombre: usuario.nombre,
					apellido: usuario.apellido,
					estrellas: stars,
					comentario,
					foto_url: fotoUrl,
				}),
			});

			if (!res.ok) {
				throw new Error("Error guardando la review");
			}

			// Recargar reviews desde la base de datos
			await fetchReviews();

			// Limpiar estado del formulario
			setStars(0);
			setComentario("");
			setFoto(null);
			setFotoPreview(null);
			setShowModal(false);
		} catch (error) {
			console.error("Error guardando la review:", error);
			setErrorMsg("Error al guardar la review. Intenta nuevamente.");
		} finally {
			setEnviando(false);
		}
	}

	useEffect(() => {
		fetchReviews();
	}, []);

	useEffect(() => {
		if (dni) {
			fetchUsuario(dni);
		}
	}, [dni]);

	return (
		<section className="min-h-screen w-full flex flex-col items-center justify-start bg-[url('/images/fondo-jacaranda.png')] bg-cover bg-center pt-0 relative">
			<div className="absolute inset-0 z-0 bg-violet-100 bg-opacity-70" />

			<div className="relative z-10 w-full flex flex-col items-center justify-start pt-0 mt-0">
				{/* Indicador de deslizar para ver más opiniones */}
				<div className="flex flex-col items-center mb-2 mt-2">
					<FaArrowsAltH className="text-violet-400 animate-bounce-x" size={32} />
					<span className="text-violet-500 text-sm mt-1 font-medium">
						Deslizá para ver más opiniones
					</span>
				</div>

				{/* Carrusel de reviews */}
				{reviews.length === 0 ? (
					// Skeleton loading para reviews
					<div className="w-full flex flex-row gap-6 overflow-x-auto scrollbar-hide">
						{[...Array(2)].map((_, i) => (
							<div
								key={i}
								className="relative flex flex-col items-center justify-center w-[98vw] max-w-[600px] min-h-[520px] px-2 animate-pulse"
							>
								{/* Círculo skeleton */}
								<div className="flex justify-center items-center w-full mb-3">
									<div
										className="rounded-full bg-violet-200/70 flex items-center justify-center"
										style={{
											width: "220px",
											height: "220px",
										}}
									></div>
								</div>
								{/* Card skeleton */}
								<div
									className="flex flex-col items-center justify-center w-full bg-white bg-opacity-70 rounded-3xl shadow-xl pt-8 pb-10 px-6"
									style={{ minHeight: "250px" }}
								>
									{/* Estrellas */}
									<div className="flex gap-2 mb-4 mt-2">
										{[1, 2, 3, 4, 5].map((n) => (
											<div
												key={n}
												className="w-10 h-10 rounded bg-violet-200/50"
											></div>
										))}
									</div>
									{/* Nombre skeleton */}
									<div className="w-1/2 h-6 bg-violet-200/60 rounded mb-3"></div>
									{/* Comentario skeleton */}
									<div className="w-full h-4 bg-violet-200/40 rounded mb-1"></div>
									<div className="w-[80%] h-4 bg-violet-200/30 rounded"></div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="w-full overflow-x-auto scrollbar-hide">
						<div className="flex flex-row gap-6 w-max pb-4">
							{reviews.map((r) => (
								<div
									key={r.id}
									className="relative flex flex-col items-center justify-center w-[98vw] max-w-[600px] min-h-[520px] px-2"
								>
									<div className="flex justify-center items-center w-full mb-3">
										<div
											className="rounded-full border-4 border-violet-300 shadow-2xl bg-white flex items-center justify-center"
											style={{
												width: "220px",
												height: "220px",
												overflow: "hidden",
											}}
										>
											{r.foto && r.foto !== "" ? (
												<Image
													src={r.foto}
													alt={`${r.user.nombre} ${r.user.apellido}`}
													width={220}
													height={220}
													className="object-cover w-[220px] h-[220px] rounded-full"
												/>
											) : (
												<div className="w-[220px] h-[220px] flex items-center justify-center text-violet-400 text-9xl font-bold">
													?
												</div>
											)}
										</div>
									</div>
									{/* Card principal pero con fondo ultra soft y sin borde fuerte */}
									<div
										className="flex flex-col items-center justify-center w-full bg-white bg-opacity-85 rounded-3xl shadow-xl pt-8 pb-10 px-6"
										style={{
											minHeight: "250px",
										}}
									>
										{/* Estrellas grandes */}
										<div className="flex gap-2 mb-4 mt-2">
											{[1, 2, 3, 4, 5].map((n) => (
												<FaStar
													key={n}
													size={44}
													color={n <= r.stars ? "#a78bfa" : "#e9d8fd"}
													className="drop-shadow"
												/>
											))}
										</div>
										{/* Nombre */}
										<div className="font-bold text-violet-700 text-2xl text-center mb-3 tracking-tight">
											{r.user.nombre} {r.user.apellido}
										</div>
										{/* Comentario */}
										{r.comentario && (
											<div className="text-violet-600 text-xl text-center leading-snug px-1 w-full break-words">
												"{r.comentario}"
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Botón sumar review */}
				<button
					onClick={() => setShowModal(true)}
					className="mt-1 mb-1 px-7 py-3 rounded-xl bg-violet-500 text-white text-lg font-bold shadow-md hover:bg-violet-600 transition active:scale-95"
					style={{ width: "90%", maxWidth: 400 }}
				>
					Sumá tu review
				</button>
			</div>

			{/* Modal emergente para nueva review */}
			{showModal && (
				<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
					<div className="bg-white rounded-2xl p-6 shadow-xl w-[95vw] max-w-md flex flex-col items-center gap-4 relative">
						<button
							className="absolute top-3 right-3 text-xl text-violet-400 font-bold"
							onClick={() => setShowModal(false)}
							aria-label="Cerrar"
						>
							×
						</button>
						<h2 className="text-xl font-bold text-violet-700 mb-2">
							Sumá tu review
						</h2>

						{/* Foto */}
						<div className="flex flex-col items-center gap-2 w-full">
							<div
								className="rounded-full border-4 border-violet-300 shadow-2xl bg-white flex items-center justify-center"
								style={{
									width: "140px",
									height: "140px",
									overflow: "hidden",
									marginBottom: 12,
								}}
								onClick={() => !fotoPreview && inputFileRef.current?.click()}
							>
								{fotoPreview ? (
									<Image
										src={fotoPreview}
										alt="Preview"
										width={140}
										height={140}
										className="object-cover w-[140px] h-[140px] rounded-full"
									/>
								) : (
									<div
										className="w-[140px] h-[140px] flex items-center justify-center"
										style={{ minWidth: 140, minHeight: 140 }}
									>
										<svg width="100" height="100" viewBox="0 0 60 60" fill="none">
											<circle
												cx="30"
												cy="30"
												r="28"
												stroke="#a78bfa"
												strokeWidth="4"
												fill="white"
											/>
											<line
												x1="30"
												y1="17"
												x2="30"
												y2="43"
												stroke="#a78bfa"
												strokeWidth="4"
												strokeLinecap="round"
											/>
											<line
												x1="17"
												y1="30"
												x2="43"
												y2="30"
												stroke="#a78bfa"
												strokeWidth="4"
												strokeLinecap="round"
											/>
										</svg>
									</div>
								)}
							</div>
							<input
								type="file"
								accept="image/*"
								ref={inputFileRef}
								className="hidden"
								onChange={handleFotoChange}
							/>
							<button
								type="button"
								className="text-xs text-violet-600 underline"
								onClick={() => inputFileRef.current?.click()}
							>
								{fotoPreview ? "Cambiar foto" : "Subir foto"}
							</button>
						</div>

						{/* Estrellas */}
						<div className="flex gap-1">
							{[1, 2, 3, 4, 5].map((n) => (
								<button
									type="button"
									key={n}
									onClick={() => setStars(n)}
									className="focus:outline-none"
								>
									<FaStar
										size={32}
										color={n <= stars ? "#a78bfa" : "#e9d8fd"}
										className="transition"
									/>
								</button>
							))}
						</div>

						{/* Comentario */}
						<textarea
							value={comentario}
							onChange={(e) => setComentario(e.target.value)}
							rows={3}
							placeholder="Agregá tu comentario (opcional)"
							className="w-full border border-violet-200 rounded-lg px-3 py-2 bg-violet-50 text-violet-800 focus:ring-2 focus:ring-violet-300 resize-none"
							maxLength={100}
						/>
						<div className="w-full text-right text-xs text-violet-400">
							{comentario.length}/100
						</div>
						{errorMsg && (
							<div className="w-full text-center text-sm text-red-500 font-semibold mb-2">
								{errorMsg}
							</div>
						)}

						{/* Botón */}
						<button
							type="button"
							className="mt-1 px-6 py-2 rounded-lg bg-violet-400 text-white font-semibold hover:bg-violet-500 transition"
							onClick={handleSubmit}
							disabled={enviando || !foto || stars === 0}
						>
							{enviando ? "Enviando..." : "Enviar review"}
						</button>
					</div>
				</div>
			)}
		</section>
	);
}