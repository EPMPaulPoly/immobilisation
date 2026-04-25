import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { authClient } from "../lib/auth-client";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        console.log("👉 LOGIN CLICKED");
        console.log("payload:", { username, password });
        try {
            const res = await authClient.signIn.email({
                email: username,
                password:password,
                callbackURL:'/historique'
            });

            console.log("👉 LOGIN SUCCESS:", res);
        } catch (err: any) {
            console.error("❌ LOGIN ERROR FULL:", err);
            console.log("❌ message:", err.message);
            console.log("❌ cause:", err.cause);
            console.log("❌ stack:", err.stack);

            setError(
                err.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
            }}
        >
            <Card sx={{ width: 380, borderRadius: 3, boxShadow: 10 }}>
                <CardContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Typography variant="h5" fontWeight={600} textAlign="center">
                        Identification Immobilisation
                    </Typography>

                    <Typography
                        variant="body2"
                        textAlign="center"
                        color="text.secondary"
                    >
                        Sign in to continue
                    </Typography>

                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setUsername(e.target.value)
                        }
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        fullWidth
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}
                        disabled={loading || !username || !password}
                        sx={{ py: 1.2, fontWeight: 600 }}
                    >
                        {loading ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : (
                            "Login"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;