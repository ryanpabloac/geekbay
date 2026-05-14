"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../../../styles/Home.module.css";

const ModalAviso = ({
  mensagem,
  aoFechar,
}: {
  mensagem: string;
  aoFechar: () => void;
}) => {
  if (!mensagem) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalConteudo}>
        <img
          src="/icone-GB.png"
          alt="Logo"
          style={{ width: "60px", marginBottom: "10px" }}
        />
        <p>{mensagem}</p>
        <button onClick={aoFechar} className={styles.btnAcao}>
          OK
        </button>
      </div>
    </div>
  );
};

const mCEP = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);

function EnderecoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mensagemModal, setMensagemModal] = useState("");
  const [formData, setFormData] = useState({
    cep: "",
    number: "",
    street: "",
    complement: "",
  });

  const [token, setToken] = useState<string | null>(null);

  const extrairEmailDoToken = (jwtToken: string) => {
    try {
      const payloadPart = jwtToken.split(".")[1];

      if (!payloadPart) {
        return null;
      }

      const normalized = payloadPart
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const padded =
        normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

      const payload = JSON.parse(atob(padded));

      return payload.email || payload.sub || payload.username || null;
    } catch (error) {
      console.error("Erro ao extrair email do token:", error);
      return null;
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url("./bg-GeekBay.png")';
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";

    setToken(
      searchParams.get("token") || localStorage.getItem("jwt_token")
    );

    return () => {
      document.body.style.backgroundImage = "";
    };
  }, [searchParams]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cep || !formData.number || !formData.street) {
      setMensagemModal(
        "Preencha CEP, número e endereço antes de salvar."
      );
      return;
    }

    if (!token) {
      setMensagemModal(
        "Usuário não encontrado. Faça login ou registre-se novamente."
      );

      setTimeout(() => router.push("/login"), 1200);

      return;
    }

    const email = extrairEmailDoToken(token);

    if (!email) {
      setMensagemModal(
        "Não foi possível identificar o usuário pelo token."
      );

      return;
    }

    try {
      const resUser = await fetch(
        `http://localhost:8080/api/usuarios/email/${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resUser.ok) {
        setMensagemModal(
          "Não foi possível localizar o usuário para salvar o endereço."
        );

        return;
      }

      const usuarioData = await resUser.json();
      const usuarioId = usuarioData?.id;

      if (!usuarioId) {
        setMensagemModal("ID do usuário não encontrado.");
        return;
      }

      const resEndereco = await fetch(
        "http://localhost:8080/api/enderecos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cep: formData.cep.replace(/\D/g, ""),
            number: formData.number,
            complement: formData.complement,
            usuarioId,
          }),
        }
      );

      if (!resEndereco.ok) {
        const err = await resEndereco.text().catch(() => null);

        console.error("Erro ao salvar endereço:", err);

        setMensagemModal(
          "Erro ao salvar endereço. Tente novamente."
        );

        return;
      }

      setMensagemModal(
        "Endereço salvo com sucesso! Redirecionando..."
      );

      setTimeout(() => router.push("/loja"), 1200);
    } catch (err) {
      console.error(err);
      setMensagemModal(
        "Erro no servidor. Tente novamente mais tarde."
      );
    }
  };

  return (
    <main>
      <header className={styles.cabecalho}>
        <img
          src="/icone-GB.png"
          alt="Logo GeekBay"
          className={styles.logo}
        />

        <h1 className={styles.nomeCabecalho}>GeekBay</h1>
      </header>

      <div
        className={styles.corpo}
        style={{
          padding: "40px 20px",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "25px",
            border: "4px solid #ff7a00",
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <img
            src="/icone-GB.png"
            alt="Logo"
            style={{ width: "50px" }}
          />

          <h2
            style={{
              color: "#ff7a00",
              marginBottom: "20px",
            }}
          >
            Informe seu endereço
          </h2>

          <form
            onSubmit={handleSalvar}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                className={styles.inputGroup}
                placeholder="CEP"
                style={{ flex: 1 }}
                value={formData.cep}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cep: mCEP(e.target.value),
                  })
                }
              />

              <input
                className={styles.inputGroup}
                placeholder="Número"
                style={{ width: "140px" }}
                inputMode="numeric"
                value={formData.number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    number: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>

            <input
              className={styles.inputGroup}
              placeholder="Endereço (Rua, Av...)"
              value={formData.street}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  street: e.target.value,
                })
              }
            />

            <input
              className={styles.inputGroup}
              placeholder="Complemento"
              value={formData.complement}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  complement: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className={styles.btnAcao}
              style={{
                width: "100%",
                marginTop: "10px",
                backgroundColor: "#ff7a00",
              }}
            >
              Salvar Endereço
            </button>
          </form>

          <Link
            href="/cadastro"
            style={{
              color: "#ff7a00",
              display: "block",
              marginTop: "15px",
              fontSize: "14px",
            }}
          >
            Voltar ao cadastro
          </Link>
        </div>
      </div>

      <ModalAviso
        mensagem={mensagemModal}
        aoFechar={() => setMensagemModal("")}
      />
    </main>
  );
}

export default function Endereco() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EnderecoContent />
    </Suspense>
  );
}