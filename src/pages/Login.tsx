import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, FieldProps } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, selectIsLoading, selectAuthError, clearError } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { loginValidationSchema, type LoginFormValues } from "@/lib/validationSchemas";
import { FieldError } from "@/components/FieldError";
import authBg from "@/assets/auth-bg.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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
            title: "Login failed",
            description: error,
            variant: "destructive",
          });
        }
      } catch {
        // If error is not JSON, treat as generic error
        toast({
          title: "Login failed",
          description: error,
          variant: "destructive",
        });
      }
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
    setBackendErrors({}); // Clear previous backend errors
    
    try {
      const result = await dispatch(loginUser({ email: values.email, password: values.password })).unwrap();
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      // Redirect to the page they were trying to access, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      // Backend errors are handled by useEffect above
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
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
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue chirping
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginValidationSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            className="bg-background/50 border-border/60 focus:border-primary/50 focus:bg-background/80 pr-10"
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
                    <FieldError error={errors.password && touched.password ? errors.password : backendErrors.password} />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
            
            <div className="text-center space-y-4">
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 hover:underline">
                Forgot your password?
              </Link>
              
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;