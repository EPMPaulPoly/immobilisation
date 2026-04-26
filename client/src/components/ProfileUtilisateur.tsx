import { FormControl, TextField, FormLabel, Button } from "@mui/material";
import { authClient } from "../lib/auth-client";
import { useState } from "react";

const ProfilUtilisateur: React.FC = () =>{
    const { data: data, isPending } = authClient.useSession();
    const [ancienMdp,defAncienMdp] = useState('');
    const [nouveauMdp,defNouveauMdp] = useState('');
    const [confNouveauMdp,defConfNouveauMdp] = useState('');
    const handleItemChange = (field:string, value:string)=>{
        if (field==='ancienMdp'){
            defAncienMdp(value)
        }
        if (field==='nouveauMdp'){
            defNouveauMdp(value)
        }
        if (field==='confNouveauMdp'){
            defConfNouveauMdp(value)
        }
    }
    const handlePasswordChange = async()=>{
        if (nouveauMdp!==confNouveauMdp){
            alert("Le nouveau mot de passe et sa confirmation ne correspondent pas.")
            return
        }
        try{
            await authClient.changePassword({currentPassword: ancienMdp, newPassword: nouveauMdp})
            alert("Mot de passe changé avec succès.")
            defAncienMdp('')
            defNouveauMdp('')
            defConfNouveauMdp('')
        }catch(error){
            alert("Erreur lors du changement de mot de passe : "+error)
        }
    }

    return(
        <div className="montre-profil" style={{padding: '10px'}}>
            <h2>Profil utilisateur</h2>
            <p>Nom: {data?.user.name}</p>
            <p>Email: {data?.user.email}</p>
            <p>Session Créée : {data?.session?.createdAt.toISOString()}</p>
            <p>Session expire: {data?.session?.expiresAt.toISOString()}</p>
            <FormControl variant="standard" fullWidth sx={{ gap: 2 }}>
                <FormLabel sx={{ color: "white" }}>Modification mot de passe</FormLabel>
                <FormControl>
                <TextField
                    key={'ancienMdp'}
                    label={"Ancien Mot de passe"}
                    value={ancienMdp}
                    onChange={(e) => handleItemChange('ancienMdp', e.target.value)}
                    variant="outlined"
                    sx={{
                        "& .MuiInputBase-input": {
                            color: "white",
                            backgroundColor: "#1f1f1f",
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                        "& .MuiInputLabel-root.Mui-disabled": {
                            color: "#cccccc",
                            WebkitTextFillColor: "#cccccc",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                            color: "#cccccc",
                            WebkitTextFillColor: "#cccccc",
                            opacity: 1,
                        },
                        "& .MuiInput-underline:before": { borderBottomColor: "white" },
                        "& .MuiInput-underline:hover:before": { borderBottomColor: "#ffcc00" },
                    }}
                />

                <TextField
                    key={'nouveauMdp'}
                    label={"Nouveau Mot de passe"}
                    value={nouveauMdp}
                    onChange={(e) => handleItemChange('nouveauMdp', e.target.value)}
                    variant="outlined"
                    sx={{
                        "& .MuiInputBase-input": {
                            color: "white",
                            backgroundColor: "#1f1f1f",
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                        "& .MuiInputLabel-root.Mui-disabled": {
                            color: "#cccccc",
                            WebkitTextFillColor: "#cccccc",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                            color: "#cccccc",
                            WebkitTextFillColor: "#cccccc",
                            opacity: 1,
                        },
                        "& .MuiInput-underline:before": { borderBottomColor: "white" },
                        "& .MuiInput-underline:hover:before": { borderBottomColor: "#ffcc00" },
                    }}
                />
                <TextField
                    key={'confNouveauMdp'}
                    label={"Confirmer Nouveau Mot de passe"}
                    value={confNouveauMdp}
                    onChange={(e) => handleItemChange('confNouveauMdp', e.target.value)}
                    variant="outlined"
                    sx={{
                        "& .MuiInputBase-input": {
                            color: "white",
                            backgroundColor: "#1f1f1f",
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                        "& .MuiInputLabel-root.Mui-disabled": {
                            color: "#cccccc",
                            WebkitTextFillColor: "#cccccc",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                            color: "#cccccc",
                            WebkitTextFillColor: "#cccccc",
                            opacity: 1,
                        },
                        "& .MuiInput-underline:before": { borderBottomColor: "white" },
                        "& .MuiInput-underline:hover:before": { borderBottomColor: "#ffcc00" },
                    }}
                />
                </FormControl>
                {(ancienMdp || nouveauMdp || confNouveauMdp) && (nouveauMdp.length>10) && (nouveauMdp===confNouveauMdp )?<>
                    <Button variant="contained" color="primary" onClick={()=>handlePasswordChange()}>
                        Changer le mode de passe
                    </Button>
                    </>:<>
                        Le mot de passe doit être de 10 charactères minimum et être confirmé pour être changé
                    </>
                }
            </FormControl>
        </div>
    )
}

export default ProfilUtilisateur;