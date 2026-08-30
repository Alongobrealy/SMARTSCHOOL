const fs = require('fs');
const content = fs.readFileSync('src/components/auth/LoginPortal.tsx', 'utf8');

const regex = /const handleSubmitAuth = \(e: React\.FormEvent\) => \{[\s\S]*?\}, 800\);\n  \};/;
const newMethod = `const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const cleanId = identifier.trim();
    const cleanSecret = passwordOrPin.trim();

    try {
      const { supabase } = await import('../../lib/supabase');
      const { formatPseudoEmail } = await import('../../utils/authUtils');
      
      let emailToUse = cleanId;
      
      if (selectedRole !== 'superadmin' && selectedRole !== 'direction') {
        emailToUse = formatPseudoEmail(selectedRole, cleanId);
      }

      // 1. SUPABASE AUTH
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: cleanSecret,
      });

      if (error) {
        setIsSubmitting(false);
        const newFailed = failedAttempts + 1;
        setFailedAttempts(newFailed);
        if (newFailed >= 3) {
          setLockoutTimer(30);
          setErrorMessage('Tentatives multiples échouées. Verrouillage de sécurité (30s).');
        } else {
          setErrorMessage('Identifiant ou mot de passe / code PIN incorrect.');
        }
        if (onAddSecurityLog) {
          onAddSecurityLog('Auth Failed', \`Accès refusé pour \${cleanId} (Rôle: \${selectedRole})\`, 'error');
        }
        return;
      }

      // 2. Fetch Profile to confirm Role & School
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      const userRole = profile?.role || selectedRole;
      const userSchoolId = profile?.school_id || 'default';
      const displayName = profile ? \`\${profile.first_name} \${profile.last_name}\` : cleanId;

      setIsSubmitting(false);
      setSuccessMessage(\`Authentification validée. Bienvenue...\`);
      
      if (onAddSecurityLog) {
        onAddSecurityLog('Login Success', \`Utilisateur authentifié (\${cleanId})\`, 'success');
      }

      setTimeout(() => {
        onLoginSuccess(
          userRole as UserRole, 
          displayName, 
          userRole, 
          userSchoolId, 
          'Établissement'
        );
      }, 500);

    } catch (err: any) {
      console.error('Login error:', err);
      setIsSubmitting(false);
      setErrorMessage(\`Erreur de connexion: \${err.message || 'Problème réseau'}\`);
    }
  };`;

const patched = content.replace(regex, newMethod);
fs.writeFileSync('src/components/auth/LoginPortal.tsx', patched);
