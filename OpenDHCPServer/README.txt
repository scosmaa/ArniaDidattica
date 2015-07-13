This release 1.64 is Stable Production Release.

ENHANCEMENTS in 1.64

1) Minor Bug Fixes

ENHANCEMENTS in 1.58/1.59

1) Subnet Selection can now be manually configured.
2) Target Relay Agent can be overridden.
3) HTTP Interface can be restricted.
4) HTTP Interface blocking fixed

DOWNLOAD

The latest version can be downloaded from http://dhcpserver.sourceforge.net/

INSTALLATION

1) Installer automatically installs the Program
2) For Windows NT/2000/XP/Vista you should let installer install it as NT Service.

   Although program's default installation directory is C:\Program Files\OpenDHCPServer
   but in Windows Vista Home, you should change it to C:\OpenDHCPServer or some
   other directory, not under C:\Program Files, as you may not have write access to
   C:\Program Files\* for editing config files.

RUNNING

1) Start Menu -> DHCP Server -> Run Standalone.
2) If you have installed as NT Service, goto Services Applet and may start/stop
   the service "Open DHCP Service".

Starting DHCP...
Server Name: LinuxServer
Detecting Static Interfaces..
Lease Status URL: http://192.168.33.2
Listening On: 192.168.33.2
Listening On: 192.168.55.2

Now try getting IP Address for another machine, it should work.

Run Stand Alone uses -v argument without any file logging. You can use -l argument
if you need logging. Running as Service always do logging depending on log level.

CONFIGURATION

1) Configuration of Server

   Server configuration is stored in enclosed OpenDHCPServer.ini file, which is self 
   explainatory. At the minimum the Server needs to be specified DHCP Range or Static Clients.
   In the packaged OpenDHCPServer.ini file, DHCP Range 192.168.0.1-DHCP Range 192.168.0.254 is 
   specified, for testing, which can be changed.
   
2) Configuration of Clients

   1. You can use windows/linux/unix mix of clients.
   2. The clients should be set to get IP Address automatically.

REPLICATED OPERATION

If you want to use two instances of DHCP Server (in hot backup operation), please use the
LDAP version of Open DHCP Server. The LDAP based server stores all it's configuration and
lease status on LDAP. Both servers read the configuration from same LDAP Server and store 
lease info on common place. When one server goes down, other can straightaway renew the 
lease issue by other server without NAK and DISCOVER.

GENERAL
   
1) This document is for guidance and is covered under GNU public license.

DEBUG

If program is not assigning addresses or resolve them check:-

1) Check network hardware and ensure that client machines has different host names from server and
   each other.
2) No other service should be running on Server on ports 67.
3) If you get error like port 67 already in use means some other DHCP program or proxy server with DHCP 
   service is running. Use any port scanner program like Active Ports to detect which program is
   listening on these ports. It is also possible that another copy of DHCPserver itself is running.
   or Microsoft connection sharing (ICS) is running, which uses these ports. How to disable ICS DNS/DHCP
   Service on your target networks, see above INTERNET CONNECTION SHARING.
4) If you still get error Static Interfaces/Listening Ports not available, it may be because of 1) Another
   DHCP Server is running or Interfaces specified on [LISTEN-ON] section are not available.
   If your interface may not be ready when your computer/Service starts and due to this service
   fails to start, use Window's recovery option in Services applet to try starting service at later time.
5) Look at OpenDHCPServer.log (if running as service) or Run in standalone mode, it will provide all debug
   information as it verbatim the activities.
6) If you use Braodband router, which also has DHCP Server, this program may still run, but some hosts
   configured by other DHCP Server may not use this DNS or DHCP Service. Please disable DHCP Service
   on Broadband Router.
7) OpenDHCPServer.state file backs up current leases and is read back when server restarts. If you want to 
   clean previous leases, you may delete this file and restart the server.
8) If you are not able to receive DHCP Discover messages from clients, make sure that DHCP Server
   and client are on same physical network (not separated by routers). If it is separated by routers and it
   is same subnet, please allow routers to pass broadcast messages to Server on Port 67. If these are 
   different subnets, use the BOOTP relay agent.
9) Make sure that firewall is allowing udp/tcp packets on ports 53 and 67.
10) If you have just upgraded from previous version and program just dies or fails to start, please
    delete OpenDHCPServer.state file and retry.

UNINSTALLATION

	Goto control panel's add/remove programs and remove the program.

BUGS
	If you find any problem with this program or need more features, please send mail to achaldhir@gmail.com.
	You may also send thanks email if it works fine for you.
	
DONATIONS

	If you find that this program is suitable for your office environment and you are using it, Please consider
	some donation for this project. $10-$50 do not make any difference to office, but it does make difference
	to Project. Very little donations have been received till now.
