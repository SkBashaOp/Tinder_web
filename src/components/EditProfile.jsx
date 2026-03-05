import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Save, UserCircle2 } from "lucide-react";
import UserCard from "./UserCard";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [skills, setSkills] = useState(
    user?.skills ? user.skills.join(", ") : ""
  );
  const [about, setAbout] = useState(user?.about || "");
  const [photoFile, setPhotoFile] = useState(null); // The actual File object
  const [photoPreview, setPhotoPreview] = useState(null); // Local preview URL
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setPhotoFile(file);
    // Create an instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tinder");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/df2xt5vbu/image/upload",
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newUserSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      let finalPhotoUrl = photoUrl;

      // Upload to Cloudinary if a new file was selected
      if (photoFile) {
        try {
          toast.info("Uploading image...", { autoClose: false, toastId: "upload" });
          finalPhotoUrl = await uploadToCloudinary(photoFile);
          toast.dismiss("upload");
        } catch (error) {
          toast.dismiss("upload");
          toast.error("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
        // Clean up local preview URL
        if (photoPreview) URL.revokeObjectURL(photoPreview);
      }

      const payload = {
        photoUrl: finalPhotoUrl,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: age ? Number(age) : undefined,
        gender: gender.trim(),
        skills: newUserSkills,
        about: about.trim(),
      };

      const res = await axios.patch(
        "/api/profile/edit",
        payload,
        { withCredentials: true }
      );

      // Wrap in the same shape that Body.jsx uses so the Navbar keeps working:
      // Redux user state is always { message, loginUser: {...} }
      const updatedUser = res.data.loginUser || res.data;
      dispatch(addUser({ message: res.data.message, loginUser: updatedUser }));
      setPhotoUrl(updatedUser?.photoUrl || finalPhotoUrl);
      setPhotoFile(null);
      setPhotoPreview(null);
      toast.success(res.data.message || "Profile updated successfully!");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || (typeof error?.response?.data === 'string' ? error.response.data : null) || "Failed to update profile";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const previewData = {
    firstName: firstName || "First",
    lastName: lastName || "Last",
    photoUrl: photoPreview || photoUrl, // Show the local preview if available
    age,
    gender,
    skills,
    about,
    _id: "preview"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-12 gap-y-10 items-start">

      {/* Edit Form */}
      <div className="lg:col-span-6 order-2 lg:order-1">
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="h-2 bg-romantic-gradient" />
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserCircle2 className="text-pink-500" />
              Edit Information
            </CardTitle>
            <CardDescription>
              This information will be displayed on your profile card.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="E.g. Jane"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="E.g. Doe"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-dashed border-border rounded-xl bg-muted/30">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md bg-zinc-200 dark:bg-zinc-800">
                      <img
                        src={photoPreview || photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=devtinder"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    {/* Floating Upload Overlay */}
                    <Label
                      htmlFor="photo-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                    >
                      <UserCircle2 size={24} />
                    </Label>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/jpeg, image/png, image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Label
                      htmlFor="photo-upload"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer w-full sm:w-auto"
                    >
                      {photoFile ? "Change Image" : "Upload Image"}
                    </Label>
                    <p className="text-xs text-muted-foreground w-full">
                      {photoFile ? <span className="text-emerald-500 font-medium">Selected: {photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)}MB)</span> : "JPG, PNG or WEBP. Max 5MB."}
                    </p>
                  </div>
                </div>


              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(Math.max(18, Number(e.target.value)))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Tech Stack (comma separated)</Label>
                <Input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Python..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About You</Label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="I'm a fullstack developer looking for a side project partner..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="romantic"
                  size="lg"
                  disabled={loading}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col gap-4 sticky top-32">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-2 border-l-2 border-pink-500">Live Preview</h3>
        <div className="pointer-events-none transform scale-95 origin-top relative z-0">
          <UserCard feed={[previewData]} />
        </div>
      </div>

    </div>
  );
};

export default EditProfile;
