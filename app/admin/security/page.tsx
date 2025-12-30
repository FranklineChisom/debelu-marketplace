"use client";

import { Shield, Lock, Key, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
                <p className="text-muted-foreground mt-1">Manage admin access, audit logs, and security protocols.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary" /> Admin Access
                        </CardTitle>
                        <CardDescription>Manage who has access to this portal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">Manage Roles</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-primary" /> API Keys
                        </CardTitle>
                        <CardDescription>Manage keys for third-party integrations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">View Keys</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" /> Audit Logs
                        </CardTitle>
                        <CardDescription>View detailed logs of system activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">View Logs</Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Emergency Protocols
                    </CardTitle>
                    <CardDescription>Actions to take in case of a security breach.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                        <div>
                            <p className="font-semibold">Force Logout All Users</p>
                            <p className="text-sm text-muted-foreground">Invalidate all active sessions immediately.</p>
                        </div>
                        <Button variant="destructive">Execute</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
