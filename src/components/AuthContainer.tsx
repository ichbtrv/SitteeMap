import React, { FormEvent, useState } from "react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import Input from "./Input";
import Sittee from "./Sittee";
import { useToast } from "./ToastProvider";

const styles = {
  form: "flex flex-col relative appear text-blue-60"
}

const AuthContainer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signIn({ email });
      if (error) throw error;
      toast?.pushInfo("Check your email for a magic link", 15000);
    } catch (_error) {
      alert("something went strong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center gap-2">
      <Sittee loading={loading} />
      {!loading && (
        <form onSubmit={handleSignin} className={styles.form}>
          <label className="absolute -top-7 right-0">Sign in with magic link</label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            required
            autoFocus
          />
        </form>
      )}
    </section>
  );
};

export default AuthContainer;
