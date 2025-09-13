import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldProps } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageCircle, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUserAsync, selectIsLoading, selectAuthError, clearError } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { signupValidationSchema, type SignupFormValues } from "@/lib/validationSchemas";
import { FieldError } from "@/components/FieldError";
import authBg from "@/assets/auth-bg.jpg";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  useEffect(() => {
    if (error) {
      // Parse backend error to extract field-specific errors
      try {
        const errorData = JSON.parse(error);
        if (errorData.errors) {
          const fieldErrors: Record<string, string> = {};
          errorData.errors.forEach((err: any) => {
            if (err.field) {
              fieldErrors[err.field] = err.message;
            }
          });
          setBackendErrors(fieldErrors);
        } else {
          // Generic error - show in toast
          toast({
            title: "Registration failed",
            description: error,
            variant: "destructive",
          });
        }
      } catch {
        // If error is not JSON, treat as generic error
        toast({
          title: "Registration failed",
          description: error,
          variant: "destructive",
        });
      }
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const validatePassword = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (values: SignupFormValues, { setSubmitting }: any) => {
    setBackendErrors({}); // Clear previous backend errors
    
    try {
      await dispatch(registerUserAsync({
        name: values.fullName,
        username: values.username,
        email: values.email,
        password: values.password,
      })).unwrap();

      toast({
        title: "Account created!",
        description: "Welcome to ChirpNest! Please sign in.",
      });
      navigate('/login');
    } catch (error: any) {
      // Backend errors are handled by useEffect above
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return "bg-destructive";
    if (passwordStrength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 4) return "Medium";
    return "Strong";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Glass Card */}
        <Card className="glass backdrop-blur-xl border-border/30 minimal-shadow">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ChirpNest
              </span>
            </div>
            <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
            <CardDescription>
              Join the conversation and start chirping today
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Formik
              initialValues={{
                fullName: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={signupValidationSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Field name="fullName">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            id="fullName"
                            placeholder="John Doe"
                            className="bg-background/50 border-border/60 focus:border-primary/50 focus:bg-background/80"
                          />
                        )}
                      </Field>
                      <FieldError error={errors.fullName && touched.fullName ? errors.fullName : backendErrors.fullName} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Field name="username">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            id="username"
                            placeholder="johndoe"
                            className="bg-background/50 border-border/60 focus:border-primary/50 focus:bg-background/80"
                          />
                        )}
                      </Field>
                      <FieldError error={errors.username && touched.username ? errors.username : backendErrors.username} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="bg-background/50 border-border/60 focus:border-primary/50 focus:bg-background/80"
                        />
                      )}
                    </Field>
                    <FieldError error={errors.email && touched.email ? errors.email : backendErrors.email} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Field name="password">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="bg-background/50 border-border/60 focus:border-primary/50 focus:bg-background/80 pr-10"
                            onChange={(e) => {
                              field.onChange(e);
                              setPasswordStrength(validatePassword(e.target.value));
                            }}
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {values.password && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${passwordStrength >= 3 ? 'text-green-600' : passwordStrength >= 2 ? 'text-yellow-600' : 'text-destructive'}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                      </div>
                    )}
                    <FieldError error={errors.password && touched.password ? errors.password : backendErrors.password} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Field name="confirmPassword">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="bg-background/50 border-border/60 focus:border-primary/50 focus:bg-background/80 pr-10"
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      {values.confirmPassword && values.password === values.confirmPassword && (
                        <Check className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <FieldError error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : backendErrors.confirmPassword} />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;